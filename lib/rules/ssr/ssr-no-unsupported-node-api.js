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
            description: 'Disallow unsupported Node.js API calls in SSR-able components.',
            category: 'LWC',
            url: docUrl('ssr/ssr-no-unsupported-node-api'),
            recommended: true,
        },
        messages: {
            unsupportedNodeApi:
                'The unsupported Node API calls are not allowed in SSR-able components.',
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
        const unsupportedNodeApis = [
            'require',
            'fs',
            'node:fs',
            'child_process',
            'node:child_process',
            'worker_threads',
            'node:worker_threads',
            'perf_hooks',
            'node:perf_hooks',
        ];

        return {
            ...withinLWCVisitors,
            CallExpression(node) {
                if (
                    (!isInsideReachableMethod() &&
                        !isInsideReachableFunction() &&
                        !inModuleScope(node, context)) ||
                    isInsideSkippedBlock()
                ) {
                    return;
                }
                const callee = node.callee;

                if (callee.type === 'Identifier' && unsupportedNodeApis.includes(callee.name)) {
                    context.report({
                        node,
                        messageId: 'unsupportedNodeApi',
                        data: {
                            identifier: callee.name,
                        },
                    });
                }
                // Member expression calls (e.g., fs.readFileSync)
                if (
                    callee.type === 'MemberExpression' &&
                    unsupportedNodeApis.includes(callee.object.name)
                ) {
                    context.report({
                        node,
                        messageId: 'unsupportedNodeApi',
                        data: { identifier: `${callee.object.name}.${callee.property.name}` },
                    });
                }
            },
        };
    },
};
