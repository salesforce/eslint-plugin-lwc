/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

let ssrEscapeFound = false;

module.exports.isSSREscape = function isSSREscape(node) {
    if (node.type === 'IfStatement' || node.type === 'ConditionalExpression') {
        ssrEscapeFound = false;
        if (checkConditionalStatements(node.test) || isWindowOrDocumentCheck(node.test)) {
            return true;
        }
    }

    return false;
};

function checkConditionalStatements(test) {
    let node = test;

    // Recursive Case: If the node is a logical expression, check its left and right parts.
    if (node.type === 'LogicalExpression' || node.type === 'BinaryExpression') {
        checkConditionalStatements(node.left);
        checkConditionalStatements(node.right);
    }

    // Base Case: If the node is an Identifier or MemberExpression, don't need to continue.
    if (node.type === 'Identifier' || node.type === 'MemberExpression' || node.type === 'Literal') {
        return ssrEscapeFound;
    }

    // Base Case: If the node is UnaryExpression, call isMetaEnvCheck().
    if (node.type === 'UnaryExpression') {
        if (node.operator === '!' && isMetaEnvCheck(node)) {
            ssrEscapeFound = true;
        }

        return ssrEscapeFound;
    }

    return ssrEscapeFound;
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
