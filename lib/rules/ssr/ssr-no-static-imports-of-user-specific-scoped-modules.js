/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../../util/doc-url');

const userScopedModulesSet = new Set([
    '@salesforce/user/',
    '@salesforce/userPermission/',
    '@salesforce/customPermission/',
]);

function isUserScopedModule(importSource) {
    return [...userScopedModulesSet].some((module) => importSource.startsWith(module));
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Disallow static imports of user-specific scoped modules in SSR-able components',
            category: 'LWC',
            url: docUrl('ssr/ssr-no-static-imports-of-user-specific-scoped-modules'),
            recommended: true,
        },
        messages: {
            noStaticUserScopedImports:
                'Static import of @salesforce user-specific scoped modules is not allowed in SSR-able components. The recommended declarative solution is to use a data provider to fetch this information.',
        },
        schema: [],
    },
    create(context) {
        return {
            // Check for static imports of user-scoped modules
            ImportDeclaration(node) {
                const importSource = node.source.value;

                if (isUserScopedModule(importSource)) {
                    context.report({
                        node,
                        messageId: 'noStaticUserScopedImports',
                    });
                }
            },
        };
    },
};
