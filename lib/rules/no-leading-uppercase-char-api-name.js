/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { isApiDecorator } = require('../util/decorator-util');

const LEADING_UPPER_CASE_REGEX = new RegExp('^[A-Z.]');

module.exports = {
    meta: {
        docs: {
            description: 'dissallow public property to start with an upper case character',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-leading-uppercase-char-api-name'),
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
                        LEADING_UPPER_CASE_REGEX.test(parent.key.name)
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
