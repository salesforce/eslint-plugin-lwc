/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-risky-node-api-in-ssrable-components', {
    valid: [
        {
            code: `
                // Safe code without the risky Node API calls
                if (import.meta.env.SSR) {
                    // Safe code
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                const fs = require('fs');

                // the risky Node API call
                fs.writeFileSync('file.txt', 'data');
            `,
            errors: [
                {
                    message: 'The risky Node API calls are not allowed in SSR-able components.',
                    line: 2,
                },
                {
                    message: 'The risky Node API calls are not allowed in SSR-able components.',
                    line: 5,
                },
            ],
        },
        {
            code: `
               require('something');
            `,
            errors: [
                {
                    message: 'The risky Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
    ],
});

testTypeScript('no-risky-node-api-in-ssrable-components', {
    valid: [
        {
            code: `
                // Safe code without the risky Node API calls
                if (import.meta.env.SSR) {
                    // Safe code
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                const fs = require('fs');

                // the risky Node API call
                fs.writeFileSync('file.txt', 'data');
            `,
            errors: [
                {
                    message: 'The risky Node API calls are not allowed in SSR-able components.',
                    line: 2,
                },
                {
                    message: 'The risky Node API calls are not allowed in SSR-able components.',
                    line: 5,
                },
            ],
        },
        {
            code: `
                    require('something');
            `,
            errors: [
                {
                    message: 'The risky Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
    ],
});
