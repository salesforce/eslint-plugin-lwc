/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

const formFactorModule = '@salesforce/client/formFactor';

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Discourage use of formFactor.',
            category: 'LWC',
            url: docUrl('no-formFactor-in-ssrable-components'),
            recommended: true,
            severity: 1, // Severity level 1 = warning
        },
        messages: {
            noFormFactorScopedImport: `Avoid using '${formFactorModule}' in SSR-able components. For best practices, refer to: https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/%40lwrjs/lwc-ssr/best_practices.md#form-factor.`,
        },
        schema: [],
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                const importSource = node.source.value;

                // Detect formFactor usage and issue a warning
                if (importSource === formFactorModule) {
                    context.report({
                        node,
                        messageId: 'noFormFactorScopedImport',
                        severity: 1, // Warning level
                    });
                }
            },
        };
    },
};
