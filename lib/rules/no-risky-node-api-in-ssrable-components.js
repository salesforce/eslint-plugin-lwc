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
            description: 'Disallow risky Node API calls in SSR-able components.',
            category: 'LWC',
            url: docUrl('no-risky-node-api-in-ssrable-components'),
            recommended: true,
        },
        messages: {
            riskyNodeApi: 'The risky Node API calls are not allowed in SSR-able components.',
        },
        schema: [],
    },
    create(context) {
        const containsRiskyApiCall = (body) =>
            /require|fs|child_process|worker_threads|perf_hooks/.test(body);

        return {
            Program(node) {
                const riskyApiCalls = [];

                node.body.forEach((statement) => {
                    const statementText = context.getSourceCode().getText(statement);
                    if (containsRiskyApiCall(statementText)) {
                        riskyApiCalls.push(statement);
                    }
                });

                riskyApiCalls.forEach((apiCallNode) => {
                    context.report({
                        node: apiCallNode,
                        messageId: 'riskyNodeApi',
                    });
                });
            },
        };
    },
};
