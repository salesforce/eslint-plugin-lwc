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
            description: 'disallow usage of "$A.localizationService"',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-aura-localization-service'),
        },
        schema: [],
    },

    create(context) {
        return {
            MemberExpression(node) {
                if (
                    node &&
                    node.object &&
                    ((node.object.type === 'Identifier' && node.object.name === '$A') ||
                        (node.object.type === 'MemberExpression' &&
                            node.object.property &&
                            node.object.property.name === '$A')) &&
                    node.property &&
                    node.property.name === 'localizationService'
                ) {
                    context.report({
                        node,
                        message: 'Disallow usage of "$A.localizationService".',
                    });
                }
            },
        };
    },
};
