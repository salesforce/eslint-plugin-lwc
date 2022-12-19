/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { noPropertyAccessDuringSSR } = require('../rule-helpers');
const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            url: docUrl('no-this-template-during-ssr'),
            category: 'LWC',
            description: 'disallow access of this.template during SSR',
        },
        schema: [],
        messages: {
            templateUsageFound:
                'You should not access `this.template` in methods that will execute during SSR.',
        },
    },
    create: (context) => {
        return noPropertyAccessDuringSSR(['template'], 'templateUsageFound', context);
    },
};
