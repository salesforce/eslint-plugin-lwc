/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { Minimatch } = require('minimatch');
const { docUrl } = require('../util/doc-url');
const { isWireDecorator } = require('../util/decorator');
const { getScope } = require('../util/context');

function getImportedIdentifier(specifierNode) {
    // Namespace imports are not analyzed because it is impossible to track accurately the usage of
    // the exported properties.
    switch (specifierNode.type) {
        case 'ImportSpecifier':
            return specifierNode.imported.name;

        case 'ImportDefaultSpecifier':
            return 'default';
    }
}

module.exports = {
    meta: {
        docs: {
            description: 'restrict unexpected wire adapter usages',
            category: 'LWC',
            url: docUrl('no-unexpected-wire-adapter-usages'),
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
            ImportDeclaration(node) {
                const scope = getScope(context, node);
                const moduleIdentifier = node.source.value;

                for (const specifier of node.specifiers) {
                    const localIdentifier = specifier.local.name;
                    const importedIdentifier = getImportedIdentifier(specifier);

                    if (!importedIdentifier) {
                        continue;
                    }

                    // Ignore imported identifier, if it is not part of the known adapter list.
                    const isKnownAdapter = knownAdapters.some((adapter) => {
                        return (
                            adapter.module.match(moduleIdentifier) &&
                            adapter.identifier.match(importedIdentifier)
                        );
                    });
                    if (!isKnownAdapter) {
                        continue;
                    }

                    // Find all the variables referencing the imported wire adapter.
                    const adapterVariable = scope.variables.find(
                        (variable) => variable.name === localIdentifier,
                    );

                    for (const adapterReference of adapterVariable.references) {
                        const adapterNode = adapterReference.identifier;

                        // Check if the wire adapter is used as the first argument or decorator
                        // call expression.
                        if (
                            adapterNode.parent.type !== 'CallExpression' ||
                            adapterNode.parent.arguments[0] !== adapterNode ||
                            !isWireDecorator(adapterNode.parent.parent)
                        ) {
                            context.report({
                                node: adapterNode,
                                message: `"${localIdentifier}" is a wire adapter and can only be used via the @wire decorator.`,
                            });
                        }
                    }
                }
            },
        };
    },
};
