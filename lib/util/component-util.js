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
    if (!node.superClass) {
        return false;
    }

    // Checking if the class extends `Element` covers 99% of the LWC cases. We can make this safer
    // in the future by ensuring that the `superClass` identifier is imported from engine.
    const sourceCode = context.getSourceCode();
    return sourceCode.getText(node.superClass) === 'LightningElement';
}

module.exports = {
    isComponent,
};
