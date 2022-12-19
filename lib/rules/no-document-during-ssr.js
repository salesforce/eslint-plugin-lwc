/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { noReferenceDuringSSR } = require('../rule-helpers');
const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            url: docUrl('no-document-during-ssr'),
            category: 'LWC',
            description: 'disallow references to document during SSR',
        },
        schema: [],
        messages: {
            documentReferenceFound:
                'You should not access `document` in methods that will execute during SSR.',
        },
    },
    create: (context) => {
        return noReferenceDuringSSR(new Set(['document']), 'documentReferenceFound', context);
    },
};
