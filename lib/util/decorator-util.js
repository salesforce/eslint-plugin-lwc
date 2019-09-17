/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const API_DECORATOR_IDENTIFIER = 'api';

/**
 * Returns true if the node is an 'api' decorator (@api)
 *
 * @param {ASTNode} node The AST node being checked.
 */
function isApiDecorator(node) {
    return (
        node.type === 'Decorator' &&
        node.expression.type === 'Identifier' &&
        node.expression.name === API_DECORATOR_IDENTIFIER
    );
}

module.exports = {
    API_DECORATOR_IDENTIFIER,
    isApiDecorator,
};
