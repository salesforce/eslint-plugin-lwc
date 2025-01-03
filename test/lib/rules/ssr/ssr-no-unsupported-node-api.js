/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../../shared');

testRule('ssr/ssr-no-unsupported-node-api', {
    valid: [
        {
            code: `
                // Safe code without the unsupported Node API calls
                if (import.meta.env.SSR) {
                    // Safe code
                }
            `,
        },
        {
            code: `
            if (!import.meta.env.SSR) {
                const fs = require('node:fs');
                fs.writeFileSync('file.txt', 'data');
            }
            `,
        },
    ],
    invalid: [
        {
            code: `
                const fs = require('fs');

                // the unsupported Node API call
                fs.writeFileSync('file.txt', 'data');
            `,
            errors: [
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                    line: 2,
                },
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
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
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
        {
            code: `
                const fs = require('node:fs');

                // Unsupported Node API call with node: prefix
                fs.writeFileSync('file.txt', 'data');
            `,
            errors: [
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                    line: 2,
                },
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                    line: 5,
                },
            ],
        },
        {
            code: `
                require('node:child_process');
            `,
            errors: [
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
    ],
});

testTypeScript('ssr/ssr-no-unsupported-node-api', {
    valid: [
        {
            code: `
                // Safe code without the unsupported Node API calls
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

                // the unsupported Node API call
                fs.writeFileSync('file.txt', 'data');
            `,
            errors: [
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                    line: 2,
                },
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                    line: 5,
                },
            ],
        },
        {
            code: `
                const fs = require('node:fs');

                // the unsupported Node API call with node: prefix in TypeScript
                fs.writeFileSync('file.txt', 'data');
            `,
            errors: [
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                    line: 2,
                },
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                    line: 5,
                },
            ],
        },
        {
            code: `
                require('node:child_process');
            `,
            errors: [
                {
                    message:
                        'The unsupported Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
    ],
});
