/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

// Map of modules with newer versions available to their replacements and messages
const MODULES_WITH_NEWER_VERSIONS = {
    'lightning/uiGraphQLApi': {
        replacement: 'lightning/graphql',
        message:
            'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
        removedExports: ['refreshGraphQL'], // APIs that don't exist in the replacement
    },
    // Add more modules with newer versions here in the future as needed
    // 'old/module': {
    //     replacement: 'new/module',
    //     message: 'A newer version is available: use new/module instead.',
    //     removedExports: [], // Optional: list of exports that don't exist in replacement
    // },
};

module.exports = {
    meta: {
        docs: {
            description: 'suggest newer versions of module imports when available',
            category: 'LWC',
            recommended: true,
            url: docUrl('newer-version-available'),
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    // Allow customization of modules with newer versions
                    modulesWithNewerVersions: {
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

        // Merge default modules with newer versions with any custom ones from options
        const modulesWithNewerVersions = {
            ...MODULES_WITH_NEWER_VERSIONS,
            ...(options.modulesWithNewerVersions || {}),
        };

        return {
            ImportDeclaration(node) {
                // Check if this import is from a module with a newer version available
                if (node.source && node.source.type === 'Literal') {
                    const importPath = node.source.value;
                    const moduleWithNewerVersion = modulesWithNewerVersions[importPath];

                    if (moduleWithNewerVersion) {
                        // Check if any imported specifiers are removed in the replacement
                        const hasRemovedExports = node.specifiers.some((specifier) => {
                            if (
                                specifier.type === 'ImportSpecifier' &&
                                moduleWithNewerVersion.removedExports
                            ) {
                                return moduleWithNewerVersion.removedExports.includes(
                                    specifier.imported.name,
                                );
                            }
                            return false;
                        });

                        // Report the module with newer version available
                        context.report({
                            node,
                            message: moduleWithNewerVersion.message,
                            fix(fixer) {
                                // Don't auto-fix if there are removed exports
                                if (hasRemovedExports) {
                                    return null;
                                }
                                // Provide auto-fix if replacement is available
                                if (moduleWithNewerVersion.replacement) {
                                    return fixer.replaceText(
                                        node.source,
                                        `'${moduleWithNewerVersion.replacement}'`,
                                    );
                                }
                            },
                        });

                        // Report additional warnings for removed exports
                        if (moduleWithNewerVersion.removedExports) {
                            node.specifiers.forEach((specifier) => {
                                if (
                                    specifier.type === 'ImportSpecifier' &&
                                    moduleWithNewerVersion.removedExports.includes(
                                        specifier.imported.name,
                                    )
                                ) {
                                    context.report({
                                        node: specifier,
                                        message: `"${specifier.imported.name}" is not available in ${moduleWithNewerVersion.replacement}. ${
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
