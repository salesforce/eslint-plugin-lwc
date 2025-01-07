/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../../util/doc-url');

const formFactorModule = '@salesforce/client/formFactor';

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Discourage use of formFactor.',
            category: 'LWC',
            url: docUrl('ssr/ssr-no-form-factor'),
            recommended: true,
        },
        messages: {
            noFormFactorScopedImport: `Avoid using '${formFactorModule}' in SSR-able components. For best practices, to prevent UI shifting on page load, utilize [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries). For images, use [responsive image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) techniques to embed the appropriate image source for various form factors.`,
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
                    });
                }
            },
        };
    },
};
