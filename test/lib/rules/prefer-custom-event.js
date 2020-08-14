/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/prefer-custom-event');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('prefer-custom-event', rule, {
    valid: [
        {
            code: `new CustomEvent('test');`,
        },
        {
            code: `
                class Event {}
                new Event('test');
            `,
        },
    ],
    invalid: [
        {
            code: `new Event('test');`,
            errors: [
                {
                    message:
                        'Prefer using "CustomEvent" constructor over "Event" for dispatching events.',
                },
            ],
        },
        {
            code: `new Event('test');`,
            env: {
                browser: true,
            },
            errors: [
                {
                    message:
                        'Prefer using "CustomEvent" constructor over "Event" for dispatching events.',
                },
            ],
        },
    ],
});
