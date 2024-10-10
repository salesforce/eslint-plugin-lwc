/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Disallow static imports of user-scoped modules, issue warnings for dynamic imports, and discourage use of formFactor.',
            category: 'LWC',
            url: docUrl('no-dynamic-imports-in-ssrable-components'),
            recommended: true,
            severity: 1, // Severity level 1 = warning
        },
        messages: {
            noDynamicUserScopedImports:
                'The recommended declarative solution is to use a [data provider](https://developer.salesforce.com/docs/platform/lwr/guide/lwr-data-providers.html) to fetch this information. The dynamic import approach shown below is considered an anti-pattern and should be avoided.',
        },
        schema: [],
    },
    create(context) {
        return {
            // Check for dynamic imports of modules
            ImportExpression(node) {
                const importSource = node.source && node.source.value;

                if (importSource) {
                    context.report({
                        node,
                        messageId: 'noDynamicUserScopedImports',
                        severity: 1, // Severity level 1 = warning
                    });
                }
            },
        };
    },
};
