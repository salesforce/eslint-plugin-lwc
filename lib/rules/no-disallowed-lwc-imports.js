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
        schema: [],
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                if (isLwcImport(node)) {
                    const { specifiers } = node;
                    if (!specifiers.length) {
                        // import 'lwc'
                        context.report({
                            message: `Invalid import. Bare imports are not allowed on "lwc". Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                            node,
                        });
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
                            !LWC_SUPPORTED_APIS.has(imported.name)
                        ) {
                            // import { fake } from 'lwc'
                            context.report({
                                message: `Invalid import. "${imported.name}" is not a known and stable API.`,
                                node: specifier,
                            });
                        }
                    }
                }
            },
            ExportNamedDeclaration(node) {
                if (isLwcImport(node)) {
                    const { specifiers } = node;
                    if (!specifiers.length) {
                        // export 'lwc'
                        context.report({
                            message: `Invalid export. Bare exports are not allowed on "lwc". Instead, use named exports: "export { LightningElement } from 'lwc'".`,
                            node,
                        });
                    }
                    for (const specifier of specifiers) {
                        const { type, local } = specifier;
                        if (type === 'ExportSpecifier' && !LWC_SUPPORTED_APIS.has(local.name)) {
                            // export { fake } from 'lwc'
                            context.report({
                                message: `Invalid export. "${local.name}" is not a known and stable API.`,
                                node: specifier,
                            });
                        }
                    }
                }
            },
            ExportAllDeclaration(node) {
                if (isLwcImport(node)) {
                    // export * from 'lwc'
                    context.report({
                        message: `Invalid export. Exporting from "lwc" is not allowed.`,
                        node,
                    });
                }
            },
        };
    },
};
