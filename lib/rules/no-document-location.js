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
            description: 'disallow document.location use, fixable to window.location.',
            category: 'Locker',
            url: docUrl('no-document-location'),
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
                    const { parent } = identifier;

                    if (parent.type !== 'MemberExpression') {
                        return false;
                    }

                    const { object, property } = parent;

                    if (
                        identifier.name === 'document' &&
                        object.type === 'Identifier' &&
                        object.name === 'document' &&
                        property.type === 'Identifier' &&
                        property.name === 'location'
                    ) {
                        // Is document.location.
                        return true;
                    }

                    const grandparent = parent.parent;

                    if (
                        identifier.name === 'window' &&
                        grandparent.type === 'MemberExpression' &&
                        grandparent.object.type === 'MemberExpression' &&
                        grandparent.object.object.type === 'Identifier' &&
                        grandparent.object.object.name === 'window' &&
                        grandparent.object.property.type === 'Identifier' &&
                        grandparent.object.property.name === 'document' &&
                        grandparent.property.type === 'Identifier' &&
                        grandparent.property.name === 'location'
                    ) {
                        // Is window.document.location.
                        return true;
                    }

                    return false;
                });

                if (ref) {
                    const { identifier } = ref;
                    const { parent } = identifier;
                    const node = identifier.name === 'document' ? parent : parent.parent;
                    context.report({
                        node,
                        message: `Invalid document.location usage. Use window.location instead.`,
                        fix: (fixer) => {
                            return [
                                fixer.insertTextAfter(node, 'window.location'),
                                fixer.remove(node),
                            ];
                        },
                    });
                }
            },
        };
    },
};
