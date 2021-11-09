/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

/**
 * In ESLint v7, class fields are called ClassProperty, whereas in ESLint v8,
 * they're called PropertyDefinition.
 * @param node
 * @returns {boolean} - True if the node is a class field
 */
function isClassField(node) {
    return node && ['ClassProperty', 'PropertyDefinition'].includes(node.type);
}

module.exports = {
    isClassField,
};
