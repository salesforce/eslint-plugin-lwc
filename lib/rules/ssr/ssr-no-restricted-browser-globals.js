/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { browser, nodeBuiltin } = require('globals');
const { noReferenceDuringSSR } = require('../../rule-helpers');
const { docUrl } = require('../../util/doc-url');

const forbiddenGlobalNames = new Set(Object.keys(browser));
forbiddenGlobalNames.delete('globalThis'); // This case we treat separately
for (const allowedGlobal of Object.keys(nodeBuiltin)) {
    forbiddenGlobalNames.delete(allowedGlobal);
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            url: docUrl('ssr/ssr-no-restricted-browser-globals'),
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
                'Invalid usage of a browser global API during SSR. Consider guarding access to `{{identifier}}`, e.g. via the `import.meta.env.SSR` flag, or optional chaining (`globalThis?.{{identifier}}`).',
            prohibitedBrowserAPIUsageGlobal:
                'Invalid usage of a browser global API during SSR. Consider guarding access to `{{identifier}}.{{property}}`, e.g. via the `import.meta.env.SSR` flag, or optional chaining (`globalThis.{{identifier}}?.{{property}}`).',
        },
    },
    create: (context) => {
        const forbiddenGlobals = new Set(forbiddenGlobalNames);
        const { 'restricted-globals': restrictedGlobals } = context.options.at(0) || {
            'restricted-globals': {},
        };
        for (const [global, isRestricted] of Object.entries(restrictedGlobals)) {
            if (isRestricted) {
                forbiddenGlobals.add(global);
            } else {
                forbiddenGlobals.delete(global);
            }
        }
        return noReferenceDuringSSR(
            forbiddenGlobals,
            ['prohibitedBrowserAPIUsage', 'prohibitedBrowserAPIUsageGlobal'],
            context,
        );
    },
};
