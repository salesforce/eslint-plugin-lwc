/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

testRule('prefer-custom-event', {
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
