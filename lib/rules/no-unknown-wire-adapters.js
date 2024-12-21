/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { Minimatch } = require('minimatch');

const { docUrl } = require('../util/doc-url');
const { getScope } = require('../util/context');

module.exports = {
    meta: {
        docs: {
            description: 'restrict usage of unknown wire adapters',
            category: 'LWC',
            url: docUrl('no-unknown-wire-adapters'),
        },

        schema: [
            {
                type: 'object',
                required: ['adapters'],
                properties: {
                    adapters: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['module', 'identifier'],
                            properties: {
                                module: {
                                    type: 'string',
                                },
                                identifier: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const knownAdapters = context.options[0].adapters.map((adapter) => {
            return {
                module: new Minimatch(adapter.module),
                identifier: new Minimatch(adapter.identifier),
            };
        });

        return {
            Decorator(node) {
                const { expression } = node;

                // Checking if the @wire decorator is valid is already covered by "valid-wire"
                // linting rule
                if (
                    expression.type !== 'CallExpression' ||
                    expression.callee.type !== 'Identifier' ||
                    expression.callee.name !== 'wire'
                ) {
                    return;
                }

                // Checking if the wire adapter is an identifier is already covered by "valid-wire"
                // linting rule
                const [adapterNode] = expression.arguments;
                if (!adapterNode || adapterNode.type !== 'Identifier') {
                    return;
                }

                const adapterName = adapterNode.name;

                // Let's resolve the reference to the wire adapter identifier in the current scope.
                const scope = getScope(context, node);
                const adapterVariable = scope.references.find(
                    (r) => r.identifier === adapterNode,
                ).resolved;
                if (!adapterVariable) {
                    return context.report({
                        node: adapterNode,
                        message: `"${adapterName}" is not a known adapter.`,
                    });
                }

                // Check if the adapter declaration is an import identifier.
                const adapterDeclarationNode = adapterVariable.identifiers[0];
                if (
                    adapterDeclarationNode.parent.type !== 'ImportSpecifier' &&
                    adapterDeclarationNode.parent.type !== 'ImportDefaultSpecifier'
                ) {
                    return context.report({
                        node: adapterNode,
                        message: `"${adapterName}" is not a known adapter.`,
                    });
                }

                // Extract the imported modules information.
                const adapterModule = adapterDeclarationNode.parent.parent.source.value;
                const importedAdapterIdentifier =
                    adapterDeclarationNode.parent.type === 'ImportSpecifier'
                        ? adapterDeclarationNode.parent.imported.name
                        : 'default';

                // Finally check if the imported identifier originates from a known module.
                const isKnownAdapter = knownAdapters.some((adapter) => {
                    return (
                        adapter.module.match(adapterModule) &&
                        adapter.identifier.match(importedAdapterIdentifier)
                    );
                });
                if (!isKnownAdapter) {
                    const localAdapterIdentifier = adapterDeclarationNode.parent.local.name;
                    return context.report({
                        node: adapterNode,
                        message: `"${localAdapterIdentifier}" from "${adapterModule}" is not a known adapter.`,
                    });
                }
            },
        };
    },
};
