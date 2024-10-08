/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

const formFactorModule = '@salesforce/client/formFactor';
const featureFlagModule = '@salesforce/featureFlag';

const userScopedModulesSet = new Set([
    '@salesforce/user/Id',
    '@salesforce/user/isGuest',
    '@salesforce/userPermission',
    '@salesforce/customPermission',
]);

function isUserScopedModule(importSource) {
    return [...userScopedModulesSet].some((module) => importSource.startsWith(module));
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Disallow static imports of user-scoped modules, issue warnings for dynamic imports, and discourage use of formFactor.',
            category: 'LWC',
            url: docUrl('no-import-of-scoped-modules-during-ssr'),
            recommended: true,
        },
        messages: {
            noStaticUserScopedImport:
                'Static import of @salesforce user modules is not allowed in server-side rendered components.',
            noDynamicUserScopedImport:
                'Dynamic import of user-scoped modules is not allowed in server-side rendered components. User-scoped values should either be retrieved from a specific cookie or derived from the existing SID cookie.',
            noFormFactorScopedImport: `Using '${formFactorModule}' is discouraged in server-side components; use CSS media queries instead.`,
            noFeatureFlagImport: `Using '${featureFlagModule}' is discouraged in server-side components.`,
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
                        messageId: 'noStaticUserScopedImport',
                        severity: 2, // Severity level 2 = error
                    });
                }

                // Check for formFactor usage
                if (importSource === formFactorModule) {
                    context.report({
                        node,
                        messageId: 'noFormFactorScopedImport',
                        severity: 1, // Severity level 1 = warning
                    });
                }

                // Check for featureFlag usage
                if (importSource.startsWith(featureFlagModule)) {
                    context.report({
                        node,
                        messageId: 'noFeatureFlagImport',
                        severity: 1, // Severity level 1 = warning
                    });
                }
            },

            // Check for dynamic imports of user-scoped modules
            ImportExpression(node) {
                const importSource = node.source && node.source.value;

                if (importSource && isUserScopedModule(importSource)) {
                    context.report({
                        node,
                        messageId: 'noDynamicUserScopedImport',
                        severity: 1, // Severity level 1 = warning
                    });
                }
            },
        };
    },
};
