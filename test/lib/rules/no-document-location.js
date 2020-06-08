/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-document-location');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

const errors = [
    {
        message: 'Invalid document.location usage. Use window.location instead.',
    },
];

ruleTester.run('no-document-location', rule, {
    valid: [
        {
            code: `window.location;`,
        },
        {
            code: `location.href;`,
        },
        {
            code: `
                const document = { location: {} };

                function scope() {
                    document.location;
                }
            `,
        },
        {
            code: `
                function scope(document) {
                    function nested() {
                        document.location;
                    }
                }
            `,
        },
        {
            code: `
                function document() {
                    function nested() {
                        document.location;
                    }
                }
            `,
        },
        {
            code: `
                const window = { document: { location: {} } };

                function scope() {
                    window.document.location;
                }
            `,
        },
        {
            code: `
                function scope(window) {
                    function nested() {
                        window.document.location;
                    }
                }
            `,
        },
        {
            code: `
                function window() {
                    function nested() {
                        window.document.location;
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `document.location;`,
            output: `window.location;`,
            errors,
        },
        {
            code: `
                const o = {
                    document() {
                        function nested() {
                            document.location;
                        }
                    }
                };
            `,
            output: `
                const o = {
                    document() {
                        function nested() {
                            window.location;
                        }
                    }
                };
            `,
            errors,
        },
        {
            code: `
                const o = {
                    window() {
                        function nested() {
                            window.document.location;
                        }
                    }
                };
            `,
            output: `
                const o = {
                    window() {
                        function nested() {
                            window.location;
                        }
                    }
                };
            `,
            errors,
        },
    ],
});
