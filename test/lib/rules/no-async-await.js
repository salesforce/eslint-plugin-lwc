/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-async-await');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-async-await', rule, {
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
