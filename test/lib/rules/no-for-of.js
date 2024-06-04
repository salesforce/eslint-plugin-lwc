/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-for-of', {
    valid: [
        {
            code: `for (let i = 0; i < 10; i++) { console.log(i); }`,
        },
        {
            code: `for (let key in obj) { console.log(key); }`,
        },
    ],
    invalid: [
        {
            code: `for (let item of obj) {}`,
            errors: [
                {
                    message: 'Invalid usage of for-of.',
                },
            ],
        },
    ],
});

testTypeScript('no-for-of', {
    valid: [
        {
            code: `for (let i: number = 0; i < 10; i++) { console.log(i); }`,
        },
        {
            code: `for (let key: string in obj) { console.log(key); }`,
        },
    ],
    invalid: [
        {
            code: `for (let item: any of (obj as object)) {}`,
            errors: [
                {
                    message: 'Invalid usage of for-of.',
                },
            ],
        },
    ],
});
