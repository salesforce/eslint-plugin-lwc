/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-rest-parameter', {
    valid: [
        {
            code: `function foo(a, b) { console.log(a, b); }`,
        },
        {
            code: `function foo() { console.log(arguments); }`,
        },
    ],
    invalid: [
        {
            code: `function foo(a, ...rest) { console.log(a, rest); }`,
            errors: [
                {
                    message: 'Invalid usage of rest parameter.',
                },
            ],
        },
    ],
});

testTypeScript('no-rest-parameter', {
    valid: [
        {
            code: `function foo(a: string, b: number) { console.log(a, b); }`,
        },
        {
            code: `function foo() { console.log(arguments); }`,
        },
    ],
    invalid: [
        {
            code: `function foo(a: any, ...rest: unknown[]) { console.log(a, rest); }`,
            errors: [
                {
                    message: 'Invalid usage of rest parameter.',
                },
            ],
        },
    ],
});
