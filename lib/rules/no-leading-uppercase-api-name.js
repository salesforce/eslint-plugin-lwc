/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { getPublicProperties } = require('../util/decorator');

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
            ClassBody(node) {
                const publicProperties = getPublicProperties(node);

                for (const publicProperty of publicProperties) {
                    if (publicProperty.name[0] === publicProperty.name[0].toUpperCase()) {
                        context.report({
                            node,
                            message: `Invalid property name syntax in "${publicProperty.name}". Property name must start with a lowercase character.`,
                        });
                    }
                }
            },
        };
    },
};
