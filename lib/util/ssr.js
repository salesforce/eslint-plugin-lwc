/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

module.exports.isSSREscape = function isSSREscape(node) {
    // TODO(117): replace this with `imports.meta.env` when we land support for that.
    return (
        node.type === 'IfStatement' &&
        node.test.type === 'BinaryExpression' &&
        node.test.left.type === 'UnaryExpression' &&
        node.test.left.operator === 'typeof' &&
        node.test.left.argument.type === 'Identifier' &&
        (node.test.left.argument.name === 'document' || node.test.left.argument.name === 'window')
    );
};
