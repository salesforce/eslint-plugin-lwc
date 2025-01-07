/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../../util/doc-url');
const { reachableDuringSSRPartial, inModuleScope } = require('../../rule-helpers');

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow mutations to the host element in connectedCallback',
            category: 'LWC',
            recommended: true,
            url: docUrl('docs/rules/ssr-no-host-mutation-in-connected-callback'),
        },
        messages: {
            noHostMutation: 'Mutations to the host element in connectedCallback are not allowed.',
        },
        schema: [],
    },
    create(context) {
        const {
            withinLWCVisitors,
            isInsideReachableMethod,
            isInsideReachableFunction,
            isInsideSkippedBlock,
        } = reachableDuringSSRPartial();
        return {
            ...withinLWCVisitors,
            MethodDefinition(node) {
                if (
                    (!isInsideReachableMethod() &&
                        !isInsideReachableFunction() &&
                        !inModuleScope(node, context)) ||
                    isInsideSkippedBlock()
                ) {
                    return;
                }
                if (isConnectedCallback(node)) {
                    const bodyStatements = node.value.body.body;

                    for (const statement of bodyStatements) {
                        if (isMutationStatement(statement)) {
                            context.report({
                                node: statement,
                                messageId: 'noHostMutation',
                            });
                        }
                    }
                }
            },
        };
    },
};

function isConnectedCallback(node) {
    return node.key.name === 'connectedCallback' && node.value.body.type === 'BlockStatement';
}

function isMutationStatement(statement) {
    return (
        statement.type === 'ExpressionStatement' &&
        statement.expression.type === 'CallExpression' &&
        isMutatingHostElement(statement.expression)
    );
}

function isMutatingHostElement(expression) {
    const callee = expression.callee;

    return (
        callee.type === 'MemberExpression' &&
        (callee.property.name === 'setAttribute' ||
            (callee.object &&
                callee.object.property &&
                callee.object.property.name === 'classList' &&
                callee.property.name === 'add'))
    );
}
