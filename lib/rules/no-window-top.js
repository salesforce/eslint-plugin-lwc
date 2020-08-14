/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        docs: {
            description: 'disallow window.top use.',
            category: 'Locker',
            url: docUrl('no-window-top'),
        },
        fixable: 'code',
        schema: [],
    },

    create(context) {
        return {
            'Program:exit'() {
                // The top level scope is the "global" scope. Depending on the "env" property in the
                // eslint config, references might not be resolved at the global scope. The most
                // reliable way to get all the unresolved references from the module is to get them
                // from the "module" scope.
                const moduleScope = context
                    .getScope()
                    .childScopes.find((childScope) => childScope.type === 'module');

                const ref = moduleScope.through.find(({ identifier }) => {
                    if (identifier.name === 'top') {
                        // Is top.
                        return true;
                    }

                    const { parent } = identifier;

                    if (parent.type !== 'MemberExpression') {
                        return false;
                    }

                    const { parent: grandparent, object, property } = parent;

                    if (
                        identifier.name === 'document' &&
                        grandparent.type === 'MemberExpression' &&
                        grandparent.object.type === 'MemberExpression' &&
                        grandparent.object.object.type === 'Identifier' &&
                        grandparent.object.object.name === 'document' &&
                        grandparent.object.property.type === 'Identifier' &&
                        grandparent.object.property.name === 'defaultView' &&
                        grandparent.property.type === 'Identifier' &&
                        grandparent.property.name === 'top'
                    ) {
                        // Is document.defaultView.top.
                        return true;
                    }

                    const { name } = object;

                    if (
                        name !== identifier.name ||
                        object.type !== 'Identifier' ||
                        property.type !== 'Identifier' ||
                        property.name !== 'top'
                    ) {
                        return false;
                    }

                    // Is frames.top, globalThis.top, self.top, or window.top.
                    // For a list of possible Window object aliases see
                    // https://html.spec.whatwg.org/multipage/window-object.html#dom-window-dev
                    return (
                        name === 'frames' ||
                        name === 'globalThis' ||
                        name === 'self' ||
                        name === 'window'
                    );
                });

                if (ref) {
                    const { identifier } = ref;
                    const { name } = identifier;

                    let node = identifier.parent;
                    if (name === 'document') {
                        node = identifier.parent.parent;
                    } else if (name === 'top') {
                        node = identifier;
                    }
                    context.report({
                        node,
                        message: `Use of window.top is prohibited.`,
                        fix: (fixer) => {
                            return [fixer.insertTextAfter(node, 'window'), fixer.remove(node)];
                        },
                    });
                }
            },
        };
    },
};
