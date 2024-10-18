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
            description: 'Disallow unsupported Node API calls in SSR-able components.',
            category: 'LWC',
            url: docUrl('ssr-no-unsupported-node-api'),
            recommended: true,
        },
        messages: {
            unsupportedNodeApi:
                'The unsupported Node API calls are not allowed in SSR-able components.',
        },
        schema: [],
    },
    create(context) {
        const containsUnsupportedApiCall = (body) =>
            /require|fs|node:fs|child_process|node:child_process|worker_threads|node:worker_threads|perf_hooks|node:perf_hooks/.test(
                body,
            );

        return {
            Program(node) {
                const unsupportedApiCalls = [];

                node.body.forEach((statement) => {
                    const statementText = context.getSourceCode().getText(statement);
                    if (containsUnsupportedApiCall(statementText)) {
                        unsupportedApiCalls.push(statement);
                    }
                });

                unsupportedApiCalls.forEach((apiCallNode) => {
                    context.report({
                        node: apiCallNode,
                        messageId: 'unsupportedNodeApi',
                    });
                });
            },
        };
    },
};
