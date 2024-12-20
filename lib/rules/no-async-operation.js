/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { getScope } = require('../util/context');
const { docUrl } = require('../util/doc-url');
const { isGlobalIdentifier } = require('../util/scope');

const GLOBAL_OBJECT = 'window';

const RESTRICTED_ASYNC_OPERATIONS = new Set(['setTimeout', 'setInterval', 'requestAnimationFrame']);

module.exports = {
    meta: {
        docs: {
            description: 'restrict usage of async operations',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-async-operation'),
        },

        schema: [],
    },

    create(context) {
        return {
            CallExpression(node) {
                const { callee } = node;
                const scope = getScope(context, node);

                // Check for direct invocation of global restricted APIs.
                // eg. setTimeout() or requestAnimationFrame();
                if (
                    callee.type === 'Identifier' &&
                    RESTRICTED_ASYNC_OPERATIONS.has(callee.name) &&
                    isGlobalIdentifier(callee, scope)
                ) {
                    context.report({
                        node,
                        message: `Restricted async operation "${callee.name}"`,
                    });
                }

                // Check for invocation of restricted APIs accessed via the global object.
                // eg. window.setTimeout() or window["setTimeout"]();
                if (callee.type === 'MemberExpression') {
                    const { object, property } = callee;

                    const isObjectGlobalObject =
                        object.type === 'Identifier' &&
                        object.name === GLOBAL_OBJECT &&
                        isGlobalIdentifier(object, scope);

                    const isPropertyRestrictedApi =
                        (property.type === 'Identifier' &&
                            RESTRICTED_ASYNC_OPERATIONS.has(property.name)) ||
                        (property.type === 'Literal' &&
                            RESTRICTED_ASYNC_OPERATIONS.has(property.value));

                    if (isObjectGlobalObject && isPropertyRestrictedApi) {
                        context.report({
                            node,
                            message: `Restricted async operation "${
                                property.name || property.value
                            }"`,
                        });
                    }
                }
            },
        };
    },
};
