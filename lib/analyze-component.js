/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { walk } = require('./walk');
const { isSSREscape } = require('./util/ssr');

const componentCache = new WeakMap();

function getModuleScopedFunctions(root) {
    return new Set(
        root.body
            .map((node) => {
                if (node.type === 'FunctionDeclaration') {
                    return (node.id && node.id.name) || '';
                } else if (
                    node.type === 'VariableDeclaration' &&
                    node.declarations.length === 1 &&
                    node.declarations[0].id.type === 'Identifier' &&
                    ((node.declarations[0].init &&
                        node.declarations[0].init.type === 'ArrowFunctionExpression') ||
                        (node.declarations[0].init &&
                            node.declarations[0].init.type === 'FunctionExpression'))
                ) {
                    return node.declarations[0].id.name;
                }
                return '';
            })
            .filter(Boolean),
    );
}

function importsLightningElementClass(root) {
    return root.body
        .map(
            (topLevelNode) =>
                topLevelNode.type === 'ImportDeclaration' &&
                topLevelNode.source.value === 'lwc' &&
                topLevelNode.specifiers.find(
                    (importSpecifier) =>
                        'imported' in importSpecifier &&
                        importSpecifier.imported.name === 'LightningElement',
                ) &&
                true,
        )
        .includes(true);
}

function getClassDeclaration(root) {
    // TODO(113): iterate over method names to look for renderedCallback, connectedCallback, etc
    //       and use this to identify possible LWCs that don't import LightningElement directly

    return (
        root.body
            .map((topLevelNode) => {
                let classDeclaration;
                if (topLevelNode.type === 'ClassDeclaration') {
                    classDeclaration = topLevelNode;
                } else if (
                    topLevelNode.type === 'ExportDefaultDeclaration' &&
                    topLevelNode.declaration.type === 'ClassDeclaration'
                ) {
                    classDeclaration = topLevelNode.declaration;
                } else {
                    return false;
                }

                return (
                    classDeclaration.superClass &&
                    classDeclaration.superClass.type === 'Identifier' &&
                    classDeclaration.superClass.name === 'LightningElement' &&
                    classDeclaration
                );
            })
            .filter(Boolean)[0] || null
    );
}
/**
 * This function analyzes a class declaration and determines which methods are invoked by other methods.
 */
function getMethodInterdependencies(classDecl) {
    const dependencies = new Map();

    const { methodNames, getters } = classDecl.body.body
        .filter((node) => node.type === 'MethodDefinition' && node.key.type === 'Identifier')
        .reduce(
            (acc, methodDefNode) => {
                const { name } = methodDefNode.key;
                acc.methodNames.push(name);
                if (methodDefNode.kind === 'get') {
                    acc.getters.push(name);
                }
                return acc;
            },
            { methodNames: [], getters: [] },
        );

    for (const methodName of methodNames) {
        dependencies.set(methodName, []);
    }

    for (const methodDefNode of classDecl.body.body) {
        if (methodDefNode.type !== 'MethodDefinition') {
            continue;
        }

        const methodName = methodDefNode.key.name;
        walk(methodDefNode.value.body, (node, _parent, { skip }) => {
            if (isSSREscape(node)) {
                skip();
            }
            if (
                node.type === 'MemberExpression' &&
                node.object.type === 'ThisExpression' &&
                node.property.type === 'Identifier' &&
                methodNames.includes(node.property.name)
            ) {
                const invokedMethod = node.property.name;
                dependencies.get(methodName).push(invokedMethod);
            }
        });
    }

    return [dependencies, getters];
}

function getMethodsReachableDuringSSR(
    methodInterdependencies,
    getters = [],
    fromMethods = ['connectedCallback', 'constructor', 'render'],
) {
    const reachableMethods = new Set();
    const examinedMethods = new Set();

    const markAsReachable = (methodName) => {
        if (examinedMethods.has(methodName)) {
            return;
        }
        // A component may not have a render method - which therefore doesn't
        // need to be marked or further checked.
        if (!methodInterdependencies.has(methodName)) {
            return;
        }
        reachableMethods.add(methodName);
        examinedMethods.add(methodName);

        const invokedMethods = methodInterdependencies.get(methodName) || [];
        for (const invokedMethod of invokedMethods) {
            markAsReachable(invokedMethod);
        }
    };

    for (const methodName of new Set([...fromMethods, ...getters])) {
        markAsReachable(methodName);
    }

    return reachableMethods;
}

function getFunctionsReachableDuringSSR(
    methodsReachableDuringSSR,
    moduleScopedFunctions,
    lwcClassDeclaration,
) {
    const reachableFunctions = new Set();

    let inLWC = false;
    walk(
        lwcClassDeclaration,
        (node, parent, { skip }) => {
            if (node === lwcClassDeclaration) {
                inLWC = true;
                return;
            } else if (!inLWC) {
                return;
            }

            if (node.type === 'MethodDefinition' && node.key.type === 'Identifier') {
                if (!methodsReachableDuringSSR.has(node.key.name)) {
                    skip();
                }
                return;
            }
            if (
                node.type === 'CallExpression' &&
                node.callee.type === 'Identifier' &&
                moduleScopedFunctions.has(node.callee.name)
            ) {
                reachableFunctions.add(node.callee.name);
            }
        },
        (node) => {
            if (node === lwcClassDeclaration) {
                inLWC = false;
            }
        },
    );

    return reachableFunctions;
}

module.exports.analyze = function analyze(root) {
    const moduleScopedFunctions = getModuleScopedFunctions(root);
    const importsLightningElement = importsLightningElementClass(root);
    const lwcClassDeclaration = (importsLightningElement && getClassDeclaration(root)) || null;
    const isLWC = !!lwcClassDeclaration;
    let moduleScopedFunctionsReachableDuringSSR = new Set();
    let methodsReachableDuringSSR = new Set();

    if (isLWC) {
        const [methodInterdependencies, getters] = getMethodInterdependencies(lwcClassDeclaration);
        methodsReachableDuringSSR = getMethodsReachableDuringSSR(methodInterdependencies, getters);
        moduleScopedFunctionsReachableDuringSSR = getFunctionsReachableDuringSSR(
            methodsReachableDuringSSR,
            moduleScopedFunctions,
            lwcClassDeclaration,
        );
    }

    const moduleRecord = {
        importsLightningElement,
        lwcClassDeclaration,
        isLWC,
        methodsReachableDuringSSR,
        moduleScopedFunctionsReachableDuringSSR,
    };

    componentCache.set(root, moduleRecord);

    return moduleRecord;
};
