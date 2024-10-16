/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-unguarded-risky-node-api-in-ssrable-components', {
    valid: [
        {
            code: `
                if (import.meta.env.SSR) {
                    // Safe code
                }
            `,
        },
        {
            code: `
                if (import.meta.env.SSR) {
                    try {
                        require('something');
                    } catch (e) {
                        // handle error
                    }
                }
            `,
        },
        {
            code: `
                const { promises: fs } = require('fs');

                if (!import.meta.env.SSR) {
                    fs.readFile('path/to/file').then(data => {
                        // process data
                    });
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                const fs = require('fs');

                if (import.meta.env.SSR) {
                    fs.writeFileSync('file.txt', 'data');
                }
            `,
            errors: [
                {
                    message:
                        'The risky unguarded Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
        {
            code: `
                if (import.meta.env.SSR) {
                    child_process.exec('some command');
                }
            `,
            errors: [
                {
                    message:
                        'The risky unguarded Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
        {
            code: `
                if (import.meta.env.SSR) {
                    require('fs');
                }
            `,
            errors: [
                {
                    message:
                        'The risky unguarded Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
        {
            code: `
                if (someCondition) {
                    if (import.meta.env.SSR && someCondition) {
                        require('child_process');
                    }
                }
            `,
            errors: [
                {
                    message:
                        'The risky unguarded Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
    ],
});

testTypeScript('no-unguarded-risky-node-api-in-ssrable-components', {
    valid: [
        {
            code: `
                if (import.meta.env.SSR) {
                    // Safe code
                }
            `,
        },
        {
            code: `
                if (import.meta.env.SSR) {
                    try {
                        require('something');
                    } catch (e) {
                        // handle error
                    }
                }
            `,
        },
        {
            code: `
                const { promises: fs } = require('fs');

                if (!import.meta.env.SSR) {
                    fs.readFile('path/to/file').then(data => {
                        // process data
                    });
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                const fs = require('fs');

                if (import.meta.env.SSR) {
                    fs.writeFileSync('file.txt', 'data');
                }
            `,
            errors: [
                {
                    message:
                        'The risky unguarded Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
        {
            code: `
                if (import.meta.env.SSR) {
                    child_process.exec('some command');
                }
            `,
            errors: [
                {
                    message:
                        'The risky unguarded Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
        {
            code: `
                if (import.meta.env.SSR) {
                    require('fs');
                }
            `,
            errors: [
                {
                    message:
                        'The risky unguarded Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
        {
            code: `
                if (someCondition) {
                    if (import.meta.env.SSR && someCondition) {
                        require('child_process');
                    }
                }
            `,
            errors: [
                {
                    message:
                        'The risky unguarded Node API calls are not allowed in SSR-able components.',
                },
            ],
        },
    ],
});
