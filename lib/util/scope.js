/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

/**
 * Check if an identifier is global or not.
 *
 * @param {ASTNode} identifier The identifier AST node.
 * @param {Scope} scope The scope to search the identifier from.
 * @returns {boolean} true if identifier is a global identifier, otherwise false.
 */
function isGlobalIdentifier(identifier, scope) {
    // Retrieve the identifier in the context of the current scope
    const ref = scope.references.find((r) => r.identifier === identifier);

    // If the reference is not resolved, or if it is resolved in the global scope it means the
    // identifier is global. ESLint automatically add global properties in the global scope
    // depending on the env config.
    // eg. "browser": true will automatically inject "window" and "setTimeout" in the global scope.
    return ref && (ref.resolved === null || ref.resolved.scope.type === 'global');
}

module.exports = {
    isGlobalIdentifier,
};
