/*
 * Copyright (c) 2023, salesforce.com, inc.
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
            url: docUrl('no-node-env-in-ssr'),
            category: 'LWC',
            description: 'disallow access of process.env.NODE_ENV in SSR',
        },
        schema: [],
        messages: {
            nodeEnvFound: 'process.env.NODE_ENV is unsupported in SSR.',
        },
    },
    create: (context) => {
        return {
            MemberExpression: (node) => {
                if (
                    node.property.type === 'Identifier' &&
                    node.property.name === 'NODE_ENV' &&
                    node.object.type === 'MemberExpression' &&
                    node.object.object.type === 'Identifier' &&
                    node.object.object.name === 'process' &&
                    node.object.property.type === 'Identifier' &&
                    node.object.property.name === 'env'
                ) {
                    context.report({
                        node,
                        messageId: 'nodeEnvFound',
                        data: {},
                    });
                }
            },
        };
    },
};
