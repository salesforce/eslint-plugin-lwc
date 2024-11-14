/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

module.exports.isSSREscape = function isSSREscape(node) {
    if (node.type === 'IfStatement' || node.type === 'ConditionalExpression') {
        console.log(`ISSSRESCPAE NODETYPE: ${node.type}`);

        if (checkConditionalStatements(node.test) || isWindowOrDocumentCheck(node.test)) {
            return true;
        }
    }

    return false;
};

module.exports.originalIsSSREscape = function originalIsSSREscape(node) {
    return (
        (node.type === 'IfStatement' || node.type === 'ConditionalExpression') &&
        (isMetaEnvCheck(node.test) || isWindowOrDocumentCheck(node.test))
    );
};

function checkConditionalStatements(test) {
    let node = test;
    console.log(`NODE TYPE: ${node.type}`);

    // Recursive Case: If the node is a logical expression, check its left and right parts.
    // TODO: Do we want to be calling this for BinaryExpression?
    if (node.type === 'LogicalExpression' || node.type === 'BinaryExpression') {
        console.log('Calling Left');
        checkConditionalStatements(node.left);

        console.log('Calling Right');
        checkConditionalStatements(node.right);
    }

    // Base Case: If the node is an Identifier or MemberExpression, don't need to continue.
    // TODO: Do we want to be calling this for Literal?
    if (node.type === 'Identifier' || node.type === 'MemberExpression' || node.type === 'Literal') {
        if (node.type === 'Literal') console.log(node.value);
        if (node.type === 'MemberExpression') console.log(node.property.name);
        return false;
    }

    // Base Case: If the node is UnaryExpression, call isMetaEnvCheck().
    if (node.type === 'UnaryExpression') {
        return isMetaEnvCheck(node);
    }

    return false;
}

// Questions:
// 1. Why is this getting called SO many times
// 2. What is the nonSSR node.property.name
// 3. What is the BinaryExpression it's calling on
// 4. Why is it even calling checkConditionalStatement on BinaryExpression
// Shouldn't it only call if IfStatement or ConditionalExpression

function isMetaEnvCheck(test) {
    let node = test;
    if (!(node.type === 'UnaryExpression' && node.operator === '!')) return false;

    node = node.argument;

    console.log(node.type);
    console.log(`INSIDE ISMETAENVCHECK(): ${node.property.name}`);

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
