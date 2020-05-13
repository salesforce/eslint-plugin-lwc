/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-dynamic-import');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

const errors = [
    {
        message: 'Use of dynamic import() is prohibited.',
    },
];

ruleTester.run('no-dynamic-import', rule, {
    valid: [
        {
            code: `// import('./a.js');`,
        },
        {
            code: `/* import('./a.js'); */`,
        },
        {
            code: `import './a.js';`,
        },
    ],
    invalid: [
        {
            code: `import('./a.js')`,
            errors,
        },
        {
            code: `
                import

                ('./a.js');
            `,
            errors,
        },
    ],
});
