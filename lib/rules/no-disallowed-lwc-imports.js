/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

const LWC_SUPPORTED_APIS = new Set([
    // Common APIs
    'LightningElement',
    'api',
    'track',
    'wire',

    // From "@lwc/engine-core"
    'getComponentDef',
    'getComponentConstructor',
    'isComponentConstructor',
    'createContextProvider',
    'readonly',
    'register',
    'setFeatureFlagForTest',
    'unwrap',

    // From "@lwc/engine-dom"
    'hydrateComponent',
    'buildCustomElementConstructor',
    'createElement',
    'LightningHTMLElement',

    // From "@lwc/engine-server"
    'renderComponent',
]);

const isLwcImport = (node) =>
    node.source && node.source.type === 'Literal' && node.source.value === 'lwc';

module.exports = {
    meta: {
        docs: {
            description: 'restrict unexpected imports from the lwc package',
            category: 'LWC',
            url: docUrl('no-disallowed-lwc-imports'),
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowlist: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    allowBareImports: {
                        type: 'boolean',
                        default: false,
                    },
                    allowExports: {
                        type: 'boolean',
                        default: false,
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        // Use the API allow list provided by option to the ESLint rule, otherwise fallback to the
        // default one.
        let lwcAllowedApis = LWC_SUPPORTED_APIS;
        const options = context.options[0] || {};
        const { allowlist, allowBareImports, allowExports } = options;
        if (allowlist) {
            lwcAllowedApis = new Set(allowlist);
        }

        return {
            ImportDeclaration(node) {
                if (isLwcImport(node)) {
                    const { specifiers } = node;
                    if (!specifiers.length) {
                        // import 'lwc'
                        if (!allowBareImports) {
                            context.report({
                                message: `Invalid import. Bare imports are not allowed on "lwc". Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                                node,
                            });
                        }
                    }
                    for (const specifier of specifiers) {
                        const { type, imported } = specifier;
                        if (type === 'ImportNamespaceSpecifier') {
                            // import * as lwc from 'lwc'
                            context.report({
                                message: `Invalid import. Namespace imports are not allowed on "lwc". Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                                node: specifier,
                            });
                        } else if (type === 'ImportDefaultSpecifier') {
                            // import lwc from 'lwc'
                            context.report({
                                message: `Invalid import. "lwc" does not have a default export. Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                                node: specifier,
                            });
                        } else if (
                            type === 'ImportSpecifier' &&
                            !lwcAllowedApis.has(imported.name)
                        ) {
                            // import { fake } from 'lwc'
                            context.report({
                                message: `Invalid import. "${imported.name}" can't be imported from "lwc".`,
                                node: specifier,
                            });
                        }
                    }
                }
            },
            ExportNamedDeclaration(node) {
                if (!allowExports) {
                    if (isLwcImport(node)) {
                        const { specifiers } = node;
                        if (!specifiers.length) {
                            // export {} from "lwc"
                            context.report({
                                message: `Invalid export. Bare exports are not allowed on "lwc". Instead, use named exports: "export { LightningElement } from 'lwc'".`,
                                node,
                            });
                        }
                        for (const specifier of specifiers) {
                            const { type, local } = specifier;
                            if (type === 'ExportSpecifier' && !lwcAllowedApis.has(local.name)) {
                                // export { fake } from 'lwc'
                                context.report({
                                    message: `Invalid export. "${local.name}" can't be imported from "lwc".`,
                                    node: specifier,
                                });
                            }
                        }
                    }
                }
            },
            ExportAllDeclaration(node) {
                if (!allowExports) {
                    if (isLwcImport(node)) {
                        // export * from 'lwc'
                        context.report({
                            message: `Invalid export. Exporting from "lwc" is not allowed.`,
                            node,
                        });
                    }
                }
            },
        };
    },
};
