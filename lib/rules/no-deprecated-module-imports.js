/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

// Map of deprecated modules to their replacements and messages
const DEPRECATED_MODULES = {
    'lightning/uiGraphQLApi': {
        replacement: 'lightning/graphql',
        message:
            'Prefer "lightning/graphql" over "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
        removedExports: ['refreshGraphQL'], // APIs that don't exist in the replacement
    },
    // Add more deprecated modules here in the future as needed
    // 'old/module': {
    //     replacement: 'new/module',
    //     message: 'Custom deprecation message',
    //     removedExports: [], // Optional: list of exports that don't exist in replacement
    // },
};

module.exports = {
    meta: {
        docs: {
            description: 'disallow use of deprecated module imports',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-deprecated-module-imports'),
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    // Allow customization of deprecated modules
                    deprecatedModules: {
                        type: 'object',
                        additionalProperties: {
                            type: 'object',
                            properties: {
                                replacement: {
                                    type: 'string',
                                },
                                message: {
                                    type: 'string',
                                },
                            },
                            required: ['replacement', 'message'],
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {};

        // Merge default deprecated modules with any custom ones from options
        const deprecatedModules = {
            ...DEPRECATED_MODULES,
            ...(options.deprecatedModules || {}),
        };

        return {
            ImportDeclaration(node) {
                // Check if this import is from a deprecated module
                if (node.source && node.source.type === 'Literal') {
                    const importPath = node.source.value;
                    const deprecatedModule = deprecatedModules[importPath];

                    if (deprecatedModule) {
                        // Check if any imported specifiers are removed in the replacement
                        const hasRemovedExports = node.specifiers.some((specifier) => {
                            if (
                                specifier.type === 'ImportSpecifier' &&
                                deprecatedModule.removedExports
                            ) {
                                return deprecatedModule.removedExports.includes(
                                    specifier.imported.name,
                                );
                            }
                            return false;
                        });

                        // Report the deprecated import
                        context.report({
                            node,
                            message: deprecatedModule.message,
                            fix(fixer) {
                                // Don't auto-fix if there are removed exports
                                if (hasRemovedExports) {
                                    return null;
                                }
                                // Provide auto-fix if replacement is available
                                if (deprecatedModule.replacement) {
                                    return fixer.replaceText(
                                        node.source,
                                        `'${deprecatedModule.replacement}'`,
                                    );
                                }
                            },
                        });

                        // Report additional warnings for removed exports
                        if (deprecatedModule.removedExports) {
                            node.specifiers.forEach((specifier) => {
                                if (
                                    specifier.type === 'ImportSpecifier' &&
                                    deprecatedModule.removedExports.includes(
                                        specifier.imported.name,
                                    )
                                ) {
                                    context.report({
                                        node: specifier,
                                        message: `"${specifier.imported.name}" is not available in ${deprecatedModule.replacement}. ${
                                            specifier.imported.name === 'refreshGraphQL'
                                                ? 'Use refresh from the wire adapter result instead.'
                                                : 'This API has been removed.'
                                        }`,
                                    });
                                }
                            });
                        }
                    }
                }
            },
        };
    },
};
