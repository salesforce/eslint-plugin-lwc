/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { isGlobalIdentifier } = require('../util/scope');

module.exports = {
    meta: {
        docs: {
            description: 'suggest usage of "CustomEvent" over "Event" constructor',
            category: 'LWC',
            recommended: true,
            url: docUrl('prefer-custom-event'),
        },

        schema: [],
    },

    create(context) {
        return {
            NewExpression(node) {
                const { callee } = node;
                const scope = context.getScope();

                if (
                    callee.type === 'Identifier' &&
                    callee.name === 'Event' &&
                    isGlobalIdentifier(callee, scope)
                ) {
                    context.report({
                        node,
                        message:
                            'Prefer using "CustomEvent" constructor over "Event" for dispatching events.',
                    });
                }
            },
        };
    },
};
