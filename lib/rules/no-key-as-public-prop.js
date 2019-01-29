/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

const API_DECORATOR_IDENTIFIER = 'api';

function isApiDecorator(node) {
    return (
        node.type === 'Decorator' &&
        node.expression.type === 'Identifier' &&
        node.expression.name === API_DECORATOR_IDENTIFIER
    );
}

module.exports = {
    meta: {
        docs: {
            description: 'validate that "key" property cannot be decorated with @api',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-key-as-public-prop'),
        },

        schema: [],
    },

    create(context) {
        return {
            Decorator(node) {
                const { parent } = node;

                if (isApiDecorator(node)) {
                    if (parent.key.type === 'Identifier') {
                        const { name } = parent.key;
                        if (name === 'key') {
                            context.report({
                                node: parent.key,
                                message: `"@api" decorators cannot be applied to property "key". The "key" is reserved for iterations and if used elsewhere will always evaluate to "undefined". Consider renaming this property.`,
                            });
                        }
                    }
                }
            },
        };
    },
};
