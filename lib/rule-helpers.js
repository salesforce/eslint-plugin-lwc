/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { analyze } = require('./analyze-component');

function reachableDuringSSRPartial() {
    let moduleInfo;
    let insideLWC = false;
    let reachableFunctionThatWeAreIn = null;
    let reachableMethodThatWeAreIn = null;
    let skippedBlockThatWeAreIn = null;

    const withinLWCVisitors = {
        Program: (node) => {
            moduleInfo = analyze(node);
        },
        ClassDeclaration: (node) => {
            if (node === moduleInfo?.lwcClassDeclaration) {
                insideLWC = true;
            }
        },
        'ClassDeclaration:exit': (node) => {
            if (node === moduleInfo?.lwcClassDeclaration) {
                insideLWC = false;
            }
        },
        FunctionDeclaration: (node) => {
            if (
                !reachableFunctionThatWeAreIn &&
                node.id?.type === 'Identifier' &&
                moduleInfo?.moduleScopedFunctionsReachableDuringSSR.has(node.id?.name)
            ) {
                reachableFunctionThatWeAreIn = node;
            }
        },
        'FunctionDeclaration:exit': (node) => {
            if (node === reachableFunctionThatWeAreIn) {
                reachableFunctionThatWeAreIn = null;
            }
        },
        FunctionExpression: (node) => {
            if (
                !reachableFunctionThatWeAreIn &&
                node.parent.type === 'VariableDeclarator' &&
                node.parent.id.type === 'Identifier' &&
                moduleInfo?.moduleScopedFunctionsReachableDuringSSR.has(node.parent.id.name)
            ) {
                reachableFunctionThatWeAreIn = node;
            }
        },
        'FunctionExpression:exit': (node) => {
            if (node === reachableFunctionThatWeAreIn) {
                reachableFunctionThatWeAreIn = null;
            }
        },
        ArrowFunctionExpression: (node) => {
            if (
                !reachableFunctionThatWeAreIn &&
                node.parent.type === 'VariableDeclarator' &&
                node.parent.id.type === 'Identifier' &&
                moduleInfo?.moduleScopedFunctionsReachableDuringSSR.has(node.parent.id.name)
            ) {
                reachableFunctionThatWeAreIn = node;
            }
        },
        'ArrowFunctionExpression:exit': (node) => {
            if (node === reachableFunctionThatWeAreIn) {
                reachableFunctionThatWeAreIn = null;
            }
        },
        MethodDefinition: (node) => {
            if (
                insideLWC &&
                node.key.type === 'Identifier' &&
                moduleInfo?.methodsReachableDuringSSR.has(node.key.name)
            ) {
                reachableMethodThatWeAreIn = node;
            }
        },
        'MethodDefinition:exit': () => {
            reachableMethodThatWeAreIn = null;
        },
        IfStatement: (node) => {
            if (
                node.test.type === 'BinaryExpression' &&
                (node.test.left.name === 'document' || node.test.right.name === 'document')
            ) {
                skippedBlockThatWeAreIn = node;
            }
        },
        'IfStatement:exit': (node) => {
            if (skippedBlockThatWeAreIn === node) {
                skippedBlockThatWeAreIn = null;
            }
        },
    };

    return {
        withinLWCVisitors,
        isInsideReachableMethod: () => insideLWC && !!reachableMethodThatWeAreIn,
        isInsideReachableFunction: () => !!reachableFunctionThatWeAreIn,
        isInsideSkippedBlock: () => !!skippedBlockThatWeAreIn,
    };
}

const moduleScopeDisqualifiers = new Set([
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
]);
function inModuleScope(node, context) {
    for (const ancestor of context.getAncestors()) {
        if (moduleScopeDisqualifiers.has(ancestor.type)) {
            return false;
        }
    }
    return true;
}

module.exports.noReferenceDuringSSR = function noReferenceDuringSSR(
    forbiddenGlobalNames,
    messageId,
    context,
) {
    const {
        withinLWCVisitors,
        isInsideReachableMethod,
        isInsideReachableFunction,
        isInsideSkippedBlock,
    } = reachableDuringSSRPartial();

    return {
        ...withinLWCVisitors,
        MemberExpression: (node) => {
            if (
                (!isInsideReachableMethod() &&
                    !isInsideReachableFunction() &&
                    !inModuleScope(node, context)) ||
                isInsideSkippedBlock()
            ) {
                return;
            }
            if (node.object.type === 'Identifier' && forbiddenGlobalNames.has(node.object.name)) {
                context.report({
                    messageId,
                    node,
                    data: {
                        identifier: node.object.name,
                    },
                });
            }
        },
        Identifier: (node) => {
            if (
                (!isInsideReachableMethod() &&
                    !isInsideReachableFunction() &&
                    !inModuleScope(node, context)) ||
                isInsideSkippedBlock()
            ) {
                return;
            }
            if (node.parent.type !== 'MemberExpression' && forbiddenGlobalNames.has(node.name)) {
                context.report({
                    messageId,
                    node,
                    data: {
                        identifier: node.name,
                    },
                });
            }
        },
    };
};

module.exports.noPropertyAccessDuringSSR = function noPropertyAccessDuringSSR(
    forbiddenPropertyNames,
    reporter,
) {
    const { withinLWCVisitors, isInsideReachableMethod, isInsideSkippedBlock } =
        reachableDuringSSRPartial();

    return {
        ...withinLWCVisitors,
        MemberExpression: (node) => {
            if (!isInsideReachableMethod() || isInsideSkippedBlock()) {
                return;
            }
            if (
                node.object.type === 'ThisExpression' &&
                node.property.type === 'Identifier' &&
                forbiddenPropertyNames.includes(node.property.name)
            ) {
                reporter(node);
            }
        },
    };
};
