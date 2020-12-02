/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

const INVALID_PROPERTY_NAME_REGEX = /(?=.*_).*[A-Z]/;

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow property names containing both uppercase and underscores.',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-uppercase-with-underscore-property-name'),
        },

        schema: [],
    },

    create(context) {
        return {
            Identifier(node) {
                if (node.name.match(INVALID_PROPERTY_NAME_REGEX)) {
                    context.report(
                        node,
                        `Avoid using both uppercase and underscores in property names: "${
                            node.name.match(INVALID_PROPERTY_NAME_REGEX)[0]
                        }"`,
                    );
                }
            },
        };
    },
};
