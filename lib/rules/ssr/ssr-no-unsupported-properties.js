/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { noPropertyAccessDuringSSR } = require('../../rule-helpers');
const { docUrl } = require('../../util/doc-url');

const disallowedProperties = [
    'attachInternals',
    'children',
    'childNodes',
    'dispatchEvent',
    'firstChild',
    'firstElementChild',
    'getBoundingClientRect',
    'getElementsByClassName',
    'getElementsByTagName',
    'lastChild',
    'lastElementChild',
    'ownerDocument',
    'querySelector',
    'querySelectorAll',
];
module.exports = {
    meta: {
        type: 'problem',
        docs: {
            url: docUrl('ssr/ssr-no-unsupported-properties'),
            category: 'LWC',
            description: 'disallow access of unsupported properties in SSR',
        },
        schema: [],
        messages: {
            propertyAccessFound:
                '`{{ identifier }}` is unsupported in SSR. Consider guarding access to `{{identifier}}` via `import.meta.env.SSR`.',
        },
    },
    create: (context) => {
        return noPropertyAccessDuringSSR(disallowedProperties, (node) => {
            context.report({
                node,
                messageId: 'propertyAccessFound',
                data: {
                    identifier: node.property.name,
                },
            });
        });
    },
};
