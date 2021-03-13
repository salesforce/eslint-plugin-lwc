/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

/**
 * Returns true if the node is a LWC component.
 *
 * @param {ASTNode} node The AST node being checked.
 * @param {Context} context The Eslint context.
 */
function isComponent(node, context) {
    const { superClass } = node;

    if (!superClass) {
        return false;
    }

    const program = context.getAncestors(node).find(({ type }) => type === 'Program');

    const importDeclaration = program.body
        .filter(({ type }) => type === 'ImportDeclaration')
        .find(({ source }) => source.value === 'lwc');

    if (importDeclaration) {
        const importSpecifier = importDeclaration.specifiers.find(
            ({ imported }) => imported.name === 'LightningElement',
        );
        if (importSpecifier) {
            return superClass.name === importSpecifier.local.name;
        }
    }

    return false;
}

module.exports = {
    isComponent,
};
