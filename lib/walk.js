/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
module.exports.walk = function walk(rootNode, visitor, exitVisitor) {
    function visit(node, parent) {
        if (!node) {
            return;
        }

        let skip_subtree = false;
        visitor(node, parent, {
            skip() {
                skip_subtree = true;
            },
        });
        if (skip_subtree) {
            return;
        }

        for (const [key, value] of Object.entries(node)) {
            if (key === 'parent' || typeof value !== 'object') {
                continue;
            }

            if (Array.isArray(value)) {
                for (const childNode of value) {
                    if (childNode && typeof childNode.type === 'string') {
                        visit(childNode, node);
                    }
                }
            } else if (value !== null && typeof value.type === 'string') {
                visit(value, node);
            }
        }

        if (exitVisitor) {
            exitVisitor(node);
        }
    }

    return visit(rootNode, null);
};
