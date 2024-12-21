/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

/**
 * Get the source code AST for the rule context.
 * @param {RuleContext} context The context for the ESLint rule
 * @returns {SourceCode} Object representing the source code AST
 */
function getSourceCode(context) {
    return context.sourceCode ?? context.getSourceCode();
}

/**
 * Get the ancestor nodes of a given node.
 * @param {RuleContext} context The context for the ESLint rule
 * @param {ASTNode} node An AST node
 * @returns {ASTNode[]} Anscestor nodes
 */
function getAncestors(context, node) {
    const sourceCode = getSourceCode(context);
    return sourceCode.getAncestors ? sourceCode.getAncestors(node) : context.getAncestors();
}

/**
 * Get the scope for a given node.
 * @param {RuleContext} context The context for the ESLint rule
 * @param {ASTNode} node An AST node
 * @returns {Scope} The scope for a given node
 */
function getScope(context, node) {
    const sourceCode = getSourceCode(context);
    return sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();
}

module.exports = {
    getAncestors,
    getScope,
    getSourceCode,
};
