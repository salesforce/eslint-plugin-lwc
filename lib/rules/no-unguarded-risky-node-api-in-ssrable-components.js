/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow unguarded risky Node API calls in SSR-able components.',
            category: 'LWC',
            url: docUrl('no-unguarded-risky-node-api-in-ssrable-components'),
            recommended: true,
        },
        messages: {
            unguardedNodeApi:
                'The risky unguarded Node API calls are not allowed in SSR-able components.',
        },
        schema: [],
    },
    create(context) {
        const isSSRContext = (node) => {
            if (node.type === 'LogicalExpression') {
                return isSSRContext(node.left) || isSSRContext(node.right);
            }

            if (node.type === 'MemberExpression') {
                if (
                    // Check for object
                    node.object.type === 'MemberExpression' &&
                    // Should be a MetaProperty
                    node.object.object.type === 'MetaProperty' &&
                    // Check for meta property
                    node.object.object.property.name === 'meta' &&
                    // Check for env property
                    node.object.property.name === 'env' &&
                    // Check for SSR property
                    node.property.name === 'SSR'
                ) {
                    return true;
                }
            }

            return false;
        };

        const containsRiskyApiCall = (body) =>
            /require|fs|child_process|worker_threads|perf_hooks/.test(body);

        const isProtected = (node) => {
            return (
                node.type === 'TryStatement' || (node.parent && node.parent.type === 'TryStatement')
            );
        };

        return {
            IfStatement(node) {
                if (isSSRContext(node.test)) {
                    const unguardedApiCalls = [];

                    node.consequent.body.forEach((statement) => {
                        const statementText = context.getSourceCode().getText(statement);
                        if (containsRiskyApiCall(statementText) && !isProtected(statement)) {
                            unguardedApiCalls.push(statement);
                        }
                    });

                    unguardedApiCalls.forEach((apiCallNode) => {
                        context.report({
                            node: apiCallNode,
                            messageId: 'unguardedNodeApi',
                        });
                    });
                }
            },
        };
    },
};
