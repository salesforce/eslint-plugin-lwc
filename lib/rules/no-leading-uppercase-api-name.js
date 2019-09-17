/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { isApiDecorator } = require('../util/decorator-util');

module.exports = {
    meta: {
        docs: {
            description: 'disallow public property to start with an upper case character',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-leading-uppercase-api-name'),
        },

        schema: [],
    },

    create(context) {
        return {
            Decorator(node) {
                const { parent } = node;

                if (isApiDecorator(node)) {
                    if (
                        parent.key.type === 'Identifier' &&
                        parent.key.name.length &&
                        parent.key.name[0] === parent.key.name[0].toUpperCase()
                    ) {
                        context.report({
                            node,
                            message: `Invalid property name syntax in "${
                                parent.key.name
                            }". Property name must start with a lowercase character.`,
                        });
                    }
                }
            },
        };
    },
};
