/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-rest-parameter');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-rest-parameter', rule, {
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
