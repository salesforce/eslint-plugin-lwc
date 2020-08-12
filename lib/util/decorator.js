/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const API_DECORATOR_IDENTIFIER = 'api';
const WIRE_DECORATOR_IDENTIFIER = 'wire';

/**
 * Checks if the given node is an 'api' decorator (@api)
 *
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean} true if the given node is an 'api' decorator otherwise false.
 */
function isApiDecorator(node) {
    return (
        node.type === 'Decorator' &&
        node.expression.type === 'Identifier' &&
        node.expression.name === API_DECORATOR_IDENTIFIER
    );
}

/**
 * Checks if the given node is a 'wire' decorator (@wire)
 *
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean} true if the given node is a 'wire' decorator otherwise false.
 */
function isWireDecorator(node) {
    return (
        node.type === 'Decorator' &&
        node.expression.type === 'CallExpression' &&
        node.expression.callee.type === 'Identifier' &&
        node.expression.callee.name === WIRE_DECORATOR_IDENTIFIER
    );
}

/**
 * Returns list of all the available public properties on a class. It only returns the list public
 * properties where the public name is known.
 *
 * @param {ASTNode} node The class body AST node.
 * @returns {Array} a list the public properties with their name and associated node.
 */
function getPublicProperties(node) {
    return node.body
        .filter((node) => {
            return (
                node.key.type === 'Identifier' &&
                node.decorators &&
                node.decorators.some(isApiDecorator)
            );
        })
        .map((node) => {
            let type;
            if (node.type === 'ClassProperty') {
                type = 'property';
            } else if (node.type === 'MethodDefinition') {
                if (node.kind === 'get') {
                    type = 'getter';
                } else if (node.kind === 'set') {
                    type = 'setter';
                } else {
                    type = 'method';
                }
            }

            return {
                name: node.key.name,
                type,
                node,
            };
        });
}

module.exports = {
    API_DECORATOR_IDENTIFIER,
    WIRE_DECORATOR_IDENTIFIER,
    isApiDecorator,
    isWireDecorator,
    getPublicProperties,
};
