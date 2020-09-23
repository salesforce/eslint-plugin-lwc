/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        docs: {
            description: 'prohibit usage of "moment" library',
            category: 'LWC',
            url: docUrl('no-moment'),
        },
        schema: [],
    },

    create(context) {
        return {
            CallExpression(node) {
                const callee = node.callee;
                const arg = node.arguments;

                if (
                    callee &&
                    callee.name === 'require' &&
                    arg &&
                    arg[0] &&
                    arg[0].value === 'moment'
                ) {
                    context.report({
                        node,
                        message: "Using 'moment' library is not allowed.",
                    });
                }
            },
            ImportDeclaration(node) {
                const { source } = node;

                if (source && source.value === 'moment') {
                    context.report({
                        node,
                        message: "Using 'moment' library is not allowed.",
                    });
                }
            },
        };
    },
};
