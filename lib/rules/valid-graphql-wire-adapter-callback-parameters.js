/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
module.exports = {
    meta: {
        docs: {
            description: 'validate graphql error callback parameter',
            category: 'LWC',
            recommended: true,
            url: docUrl('valid-graphql-wire-adapter-callback-parameters'),
        },

        schema: [],
    },

    create(context) {
        return {
            MethodDefinition(node) {
                const { decorators } = node;

                // Check that the @wire decorator is using graphql
                const graphQlDecorator = (decorators || []).find((decorator) => {
                    if (decorator.expression && decorator.expression.arguments) {
                        return decorator.expression.arguments.some((argument) => {
                            return argument.name === 'graphql';
                        });
                    }
                    return false;
                });

                // Verify that the method definition is using 'errors' not 'error
                if (graphQlDecorator !== undefined) {
                    if (node.value.type === 'FunctionExpression') {
                        const objectPatternNode = node.value.params.find(
                            (param) => param.type === 'ObjectPattern',
                        );
                        if (objectPatternNode !== undefined) {
                            // Check the destructured key, not the local binding name, so that
                            // `{ error: e }` is caught and `{ errors: error }` is allowed.
                            // Rest elements (`...rest`) have no key and are skipped.
                            const incorrectErrorParameter = objectPatternNode.properties.some(
                                (property) => {
                                    if (property.type !== 'Property' || property.computed) {
                                        return false;
                                    }
                                    const { key } = property;
                                    const keyName =
                                        key.type === 'Identifier' ? key.name : key.value;
                                    return keyName === 'error';
                                },
                            );
                            if (incorrectErrorParameter) {
                                context.report({
                                    node,
                                    message:
                                        '@wire graphql callback function object must use "errors" instead of "error"',
                                });
                            }
                        }
                    }
                }
            },
        };
    },
};
