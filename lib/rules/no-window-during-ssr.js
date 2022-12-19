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
            url: docUrl('no-window-during-ssr'),
            category: 'LWC',
            description: 'disallow references to window during SSR',
        },
        schema: [],
        messages: {
            windowReferenceFound:
                'You should not access `window` in methods that will execute during SSR.',
        },
    },
    create: (context) => {
        return noReferenceDuringSSR(new Set(['window']), 'windowReferenceFound', context);
    },
};
