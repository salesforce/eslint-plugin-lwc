/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../../util/doc-url');

// Default APIs that are not supported in SSR context
const SSR_DISALLOWED_APIS = new Set(['readonly']);

const isLwcImport = (node) =>
    node.source && node.source.type === 'Literal' && node.source.value === 'lwc';

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'restrict specific imports from the lwc package in SSR-able components',
            category: 'LWC',
            url: docUrl('ssr/ssr-no-disallowed-lwc-imports'),
            recommended: true,
        },
        messages: {
            invalidImport:
                'Invalid import. "{{importName}}" from "lwc" cannot be used in SSR context.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    disallowlist: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'List of LWC APIs to disallow in SSR context',
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {};
        const { disallowlist } = options;

        // Use custom disallowlist if provided, otherwise use default
        let ssrDisallowedApis = SSR_DISALLOWED_APIS;
        if (disallowlist) {
            ssrDisallowedApis = new Set(disallowlist);
        }

        return {
            ImportDeclaration(node) {
                if (isLwcImport(node)) {
                    const { specifiers } = node;
                    for (const specifier of specifiers) {
                        const { type, imported } = specifier;
                        if (type === 'ImportSpecifier' && ssrDisallowedApis.has(imported.name)) {
                            // import { readonly } from 'lwc'
                            context.report({
                                node: specifier,
                                messageId: 'invalidImport',
                                data: {
                                    importName: imported.name,
                                },
                            });
                        }
                    }
                }
            },
        };
    },
};
