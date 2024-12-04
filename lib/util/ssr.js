/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

module.exports.isSSREscape = function isSSREscape(node) {
    if (
        (node.type === 'IfStatement' || node.type === 'ConditionalExpression') &&
        checkConditionalStatements(node.test)
    ) {
        return true;
    }

    return false;
};

function checkConditionalStatements(test) {
    let node = test;

    // Base Case: If the node is a `!` UnaryExpression, call isMetaEnvCheck().
    if (node.type === 'UnaryExpression' && node.operator === '!') {
        return isMetaEnvCheck(node);
    }

    // Base Case: If the node is a `!==` BinaryExpresion, call isWindowOrDocumentCheck().
    if (node.type === 'BinaryExpression' && node.operator === '!==') {
        return isWindowOrDocumentCheck(node);
    }

    // Recursive Case: If the node is a `&&` logical expression, check its left and right parts.
    if (node.type === 'LogicalExpression' && node.operator === '&&') {
        const rightNodeConditional = checkConditionalStatements(node.right);
        return rightNodeConditional || checkConditionalStatements(node.left);
    }

    return false;
}

function isMetaEnvCheck(test) {
    let node = test;
    if (!(node.type === 'UnaryExpression' && node.operator === '!')) return false;

    node = node.argument;
    if (
        !(
            node.type === 'MemberExpression' &&
            node.property.type === 'Identifier' &&
            node.property.name === 'SSR'
        )
    )
        return false;

    node = node.object;
    if (
        !(
            node.type === 'MemberExpression' &&
            node.property.type === 'Identifier' &&
            node.property.name === 'env'
        )
    )
        return false;

    node = node.object; // .meta is not a MemberExpression, it's a MetaProperty in eslint
    if (
        !(
            node.type === 'MetaProperty' &&
            node.property.type === 'Identifier' &&
            node.property.name === 'meta'
        )
    )
        return false;

    node = node.meta;
    return node.type && node.name === 'import';
}

function isWindowOrDocumentCheck(node) {
    return (
        node.type === 'BinaryExpression' &&
        node.left.type === 'UnaryExpression' &&
        node.left.operator === 'typeof' &&
        node.left.argument.type === 'Identifier' &&
        (node.left.argument.name === 'document' || node.left.argument.name === 'window')
    );
}
