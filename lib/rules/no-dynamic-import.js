/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        docs: {
            description: 'disallow dynamic import use.',
            category: 'Locker',
            url: docUrl('no-dynamic-import'),
        },
        schema: [],
    },

    create(context) {
        return {
            ImportExpression(node) {
                context.report({
                    node,
                    message: `Use of dynamic import() is prohibited.`,
                });
            },
        };
    },
};
