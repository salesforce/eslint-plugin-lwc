/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { analyze } = require('./analyze-component');
const { isSSREscape } = require('./util/ssr');
const { isGlobalIdentifier } = require('./util/scope');
const { getAncestors, getScope } = require('./util/context');

/**
 * Visitors for detecting methods/functions that are reachable during SSR
 */
function reachableDuringSSRPartial() {
    let moduleInfo;
    let reachableFunctionThatWeAreIn = null;
    let reachableMethodThatWeAreIn = null;
    let skippedBlockThatWeAreIn = null;
    let skippedConditionThatWeAreIn = null;

    const withinLWCVisitors = {
        Program: (node) => {
            moduleInfo = analyze(node);
        },
        FunctionDeclaration: (node) => {
            if (
                !reachableFunctionThatWeAreIn &&
                node.id &&
                node.id.type === 'Identifier' &&
                ((moduleInfo.isLWC &&
                    moduleInfo.moduleScopedFunctionsReachableDuringSSR.has(
                        node.id && node.id.name,
                    )) ||
                    !moduleInfo.isLWC)
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
                ((moduleInfo.isLWC &&
                    moduleInfo.moduleScopedFunctionsReachableDuringSSR.has(node.parent.id.name)) ||
                    !moduleInfo.isLWC)
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
                ((moduleInfo.isLWC &&
                    moduleInfo.moduleScopedFunctionsReachableDuringSSR.has(node.parent.id.name)) ||
                    !moduleInfo.isLWC)
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
                node.key.type === 'Identifier' &&
                ((moduleInfo.isLWC && moduleInfo.methodsReachableDuringSSR.has(node.key.name)) ||
                    !moduleInfo.isLWC)
            ) {
                reachableMethodThatWeAreIn = node;
            }
        },
        'MethodDefinition:exit': () => {
            reachableMethodThatWeAreIn = null;
        },
        IfStatement: (node) => {
            if (isSSREscape(node)) {
                skippedBlockThatWeAreIn = node;
            }
        },
        'IfStatement:exit': (node) => {
            if (skippedBlockThatWeAreIn === node) {
                skippedBlockThatWeAreIn = null;
            }
        },
        ConditionalExpression: (node) => {
            if (isSSREscape(node)) {
                skippedConditionThatWeAreIn = node;
            }
        },
        'ConditionalExpression:exit': (node) => {
            if (skippedConditionThatWeAreIn === node) {
                skippedConditionThatWeAreIn = null;
            }
        },
    };

    return {
        withinLWCVisitors,
        isInsideReachableMethod: () => !!reachableMethodThatWeAreIn,
        isInsideReachableFunction: () => !!reachableFunctionThatWeAreIn,
        isInsideSkippedBlock: () => !!skippedBlockThatWeAreIn || !!skippedConditionThatWeAreIn,
    };
}

const moduleScopeDisqualifiers = new Set([
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
]);

const noReferenceParentQualifiers = new Set([
    'CallExpression',
    'ExpressionStatement',
    'AssignmentExpression',
]);

const globalAccessQualifiers = new Set(['CallExpression', 'MemberExpression']);

function inModuleScope(node, context) {
    for (const ancestor of getAncestors(context, node)) {
        if (moduleScopeDisqualifiers.has(ancestor.type)) {
            return false;
        }
    }
    return true;
}

function noReferenceDuringSSR(forbiddenGlobalNames, messageIds, context) {
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

            if (
                node.parent.type === 'MemberExpression' &&
                node.object.type === 'Identifier' &&
                ((node.object.name === 'globalThis' && node.parent.optional !== true) ||
                    node.object.name === 'window') &&
                node.property.type === 'Identifier' &&
                forbiddenGlobalNames.has(node.property.name) &&
                isGlobalIdentifier(node.object, getScope(context, node))
            ) {
                // Prevents expressions like:
                // globalThis.document.addEventListener('click', () => { ... });
                // const url = window.location.href;
                // const url = window.location?.href;

                // Allows expressions like:
                // globalThis.document?.addEventListener('click', () => { ... });
                // const url = globalThis.location?.href;
                context.report({
                    messageId: messageIds.at(1),
                    node,
                    data: {
                        identifier: node.property.name,
                        property: node.parent.property.name,
                    },
                });
            } else if (
                node.parent.type === 'CallExpression' &&
                node.parent.optional !== true &&
                node.object.type === 'Identifier' &&
                node.object.name === 'globalThis' &&
                node.property.type === 'Identifier' &&
                forbiddenGlobalNames.has(node.property.name) &&
                isGlobalIdentifier(node.object, getScope(context, node))
            ) {
                // Prevents expressions like:
                // globalThis.addEventListener('click', () => { ... });

                // Allows expressions like:
                // globalThis.addEventListener?.('click', () => { ... });
                context.report({
                    messageId: messageIds.at(0),
                    node,
                    data: {
                        identifier:
                            node.object.name === 'globalThis'
                                ? node.property.name
                                : node.object.name,
                    },
                });
            } else if (
                node.parent.type !== 'MemberExpression' &&
                node.object.type === 'Identifier' &&
                forbiddenGlobalNames.has(node.object.name) &&
                isGlobalIdentifier(node.object, getScope(context, node))
            ) {
                // Prevents expressions like:
                // window.addEventListener('click', () => { ... });
                // window?.addEventListener('click', () => { ... });
                // document.addEventListener('click', () => { ... });
                // document?.addEventListener('click', () => { ... });
                context.report({
                    messageId: messageIds.at(0),
                    node,
                    data: {
                        identifier:
                            node.object.name === 'window' ? node.property.name : node.object.name,
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

            if (
                noReferenceParentQualifiers.has(node.parent.type) &&
                forbiddenGlobalNames.has(node.name) &&
                isGlobalIdentifier(node, getScope(context, node))
            ) {
                // Prevents expressions like:
                // doSomethingWith(window);
                // doSomethingWith(document);

                // Allows expressions like:
                // doSomethingWith(globalThis)
                context.report({
                    messageId: messageIds.at(0),
                    node,
                    data: {
                        identifier: node.name,
                    },
                });
            } else if (
                node.parent.type === 'BinaryExpression' &&
                node.parent.operator === 'instanceof' &&
                node.parent.right === node &&
                forbiddenGlobalNames.has(node.name) &&
                isGlobalIdentifier(node, getScope(context, node))
            ) {
                // Prevents expressions like:
                // if (value instanceof Element) { ... }
                // value instanceof Element ? doX() : doY();
                context.report({
                    messageId: messageIds.at(0),
                    node,
                    data: {
                        identifier: node.name,
                    },
                });
            }
        },
        ExpressionStatement: (node) => {
            if (
                node.parent.type === 'Program' &&
                node.expression.type === 'CallExpression' &&
                node.expression.callee.type === 'Identifier' &&
                forbiddenGlobalNames.has(node.expression.callee.name) &&
                isGlobalIdentifier(node, getScope(context, node))
            ) {
                // Prevents global expressions like:
                // addEventListener('resize', () => {...});

                context.report({
                    messageId: messageIds.at(0),
                    node,
                    data: {
                        identifier: node.name,
                    },
                });
            }
        },
    };
}

/**
 * Reports issues about accessing unsupported LWC class methods in SSR.
 * @see {@link https://github.com/salesforce/lwc/blob/master/packages/%40lwc/engine-server/src/renderer.ts}
 */
function noPropertyAccessDuringSSR(forbiddenPropertyNames, reporter) {
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
                globalAccessQualifiers.has(node.parent.type) &&
                node.property.type === 'Identifier' &&
                forbiddenPropertyNames.includes(node.property.name)
            ) {
                // Prevents expressions like:
                // this.dispatchEvent(new CustomEvent('myevent'));
                // this.querySelector('button').addEventListener('click', ...);
                // this.querySelector?.('button').addEventListener('click', ...);
                // this.querySelector?.('button')?.addEventListener('click', ...);
                // this.querySelector?.('button')?.addEventListener?.('click', ...);
                // this.querySelector?.('button').firstElementChild.id;
                // this.querySelector?.('button').firstElementChild?.id;
                // this.childNodes.item(0).textContent = 'foo';
                reporter(node);
            }
        },
    };
}

function noNodeEnvInSSR(context) {
    const {
        withinLWCVisitors,
        isInsideReachableFunction,
        isInsideReachableMethod,
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
            if (
                node.property.type === 'Identifier' &&
                node.property.name === 'NODE_ENV' &&
                node.object.type === 'MemberExpression' &&
                node.object.object &&
                node.object.object.type === 'Identifier' &&
                node.object.object.name === 'process' &&
                node.object.property.type === 'Identifier' &&
                node.object.property.name === 'env'
            ) {
                context.report({
                    node,
                    messageId: 'nodeEnvFound',
                    data: {
                        identifier: node.property.name,
                    },
                });
            }
        },
    };
}

module.exports = {
    inModuleScope,
    reachableDuringSSRPartial,
    noPropertyAccessDuringSSR,
    noReferenceDuringSSR,
    noNodeEnvInSSR,
};
