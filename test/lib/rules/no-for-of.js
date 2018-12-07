/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-for-of');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-for-of', rule, {
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
