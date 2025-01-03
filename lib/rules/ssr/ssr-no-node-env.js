/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { noNodeEnvInSSR } = require('../../rule-helpers');
const { docUrl } = require('../../util/doc-url');

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            url: docUrl('ssr/ssr-no-node-env'),
            category: 'LWC',
            description: 'disallow access of process.env.NODE_ENV in SSR',
        },
        schema: [],
        messages: {
            nodeEnvFound: 'process.env.NODE_ENV is unsupported in SSR.',
        },
    },
    create: (context) => {
        return noNodeEnvInSSR(context);
    },
};
