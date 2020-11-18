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
            CallExpression(node) {
                const { callee } = node;

                if (
                    callee.object &&
                    callee.object.object &&
                    callee.object.object.name === '$A' &&
                    callee.object.property &&
                    callee.object.property.name === 'localizationService'
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
