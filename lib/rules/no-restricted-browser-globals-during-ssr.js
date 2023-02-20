/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { browser, nodeBuiltin } = require('globals');
const { noReferenceDuringSSR } = require('../rule-helpers');
const { docUrl } = require('../util/doc-url');

const forbiddenGlobalNames = new Set(Object.keys(browser));
for (const allowedGlobal of Object.keys(nodeBuiltin)) {
    forbiddenGlobalNames.delete(allowedGlobal);
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            url: docUrl('no-browser-globals-during-ssr'),
            category: 'LWC',
            description: 'disallow access to global browser APIs during SSR',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    'restricted-globals': {
                        type: 'object',
                        additionalProperties: {
                            type: 'boolean',
                        },
                    },
                },
            },
        ],
        messages: {
            prohibitedBrowserAPIUsage:
                'Invalid usage of a browser global API during SSR. Consider moving `{{identifier}}` to the `renderedCallback`.',
        },
    },
    create: (context) => {
        const forbiddenGlobals = new Set(forbiddenGlobalNames);
        const { 'restricted-globals': restrictedGlobals } = context.options[0] || {
            'restricted-globals': {},
        };
        for (const [global, isRestricted] of Object.entries(restrictedGlobals)) {
            if (isRestricted) {
                forbiddenGlobals.add(global);
            } else {
                forbiddenGlobals.delete(global);
            }
        }
        return noReferenceDuringSSR(forbiddenGlobals, 'prohibitedBrowserAPIUsage', context);
    },
};
