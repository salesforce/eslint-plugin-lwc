/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../../shared');

testRule('ssr/ssr-no-disallowed-lwc-imports', {
    valid: [
        {
            code: `import { LightningElement } from 'lwc';`,
        },
        {
            code: `import { LightningElement, api, track, wire } from 'lwc';`,
        },
        {
            code: `import { readonly } from 'lwc';`,
            options: [{ disallowlist: ['track'] }],
        },
    ],
    invalid: [
        {
            code: `import { readonly } from 'lwc';`,
            errors: [
                {
                    message: 'Invalid import. "readonly" from "lwc" cannot be used in SSR context.',
                },
            ],
        },
        {
            code: `import { LightningElement, readonly } from 'lwc';`,
            errors: [
                {
                    message: 'Invalid import. "readonly" from "lwc" cannot be used in SSR context.',
                },
            ],
        },
        {
            code: `import { track } from 'lwc';`,
            options: [{ disallowlist: ['track'] }],
            errors: [
                {
                    message: 'Invalid import. "track" from "lwc" cannot be used in SSR context.',
                },
            ],
        },
    ],
});
