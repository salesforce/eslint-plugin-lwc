/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

testRule('no-async-await', {
    valid: [
        {
            code: `function foo () {}`,
        },
        {
            code: `const foo = function() {}`,
        },
        {
            code: `const foo = () => {}`,
        },
        {
            code: `class Foo { foo() {} }`,
        },
    ],
    invalid: [
        {
            code: `async function foo() {}`,
            errors: [
                {
                    message: 'Invalid usage of async-await.',
                },
            ],
        },
        {
            code: `const foo = async function() {}`,
            errors: [
                {
                    message: 'Invalid usage of async-await.',
                },
            ],
        },
        {
            code: `const foo = async () => {}`,
            errors: [
                {
                    message: 'Invalid usage of async-await.',
                },
            ],
        },
        {
            code: `class Foo { async foo() {} }`,
            errors: [
                {
                    message: 'Invalid usage of async-await.',
                },
            ],
        },
    ],
});
