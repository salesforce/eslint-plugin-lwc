/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { noReferenceDuringSSR } = require('../rule-helpers');
const { docUrl } = require('../util/doc-url');
const { browser } = require('globals');

const forbiddenGlobalNames = new Set(Object.keys(browser));

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            url: docUrl('no-browser-globals-during-ssr'),
            category: 'LWC',
            description: 'disallow access to global browser APIs during SSR',
        },
        schema: [],
        messages: {
            prohibitedBrowserAPIUsage:
                '`{{identifier}}`, like most browser APIs, is not accessible during SSR.',
        },
    },
    create: (context) => {
        return noReferenceDuringSSR(forbiddenGlobalNames, 'prohibitedBrowserAPIUsage', context);
    },
};
