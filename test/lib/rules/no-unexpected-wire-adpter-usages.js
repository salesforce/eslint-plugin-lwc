/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-rest-parameter');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-unexpected-wire-adapter-usage', rule, {
    valid: [
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo)
                wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo as getBar } from 'adapter';

            class Test {
                @wire(getBar)
                wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @wire(getFoo)
                wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'default' }],
                },
            ],
        },
    ],
    invalid: [
        {
            code: `import { getFoo } from 'adapter';
            const getBar = getFoo;`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
            errors: [
                {
                    message: 'TODO',
                },
            ],
        },
        {
            code: `import { getFoo } from 'adapter';
            method(getFoo);`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
            errors: [
                {
                    message: 'TODO',
                },
            ],
        },
        {
            code: `import { getFoo } from 'adapter';
            new getFoo();`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
            errors: [
                {
                    message: 'TODO',
                },
            ],
        },
        {
            code: `import { getFoo } from 'adapter';
            getFoo.call();`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
            errors: [
                {
                    message: 'TODO',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo, getFoo)
                wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
            errors: [
                {
                    message: 'TODO',
                },
            ],
        },
        {
            code: `export { getFoo } from 'adapter';`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
            errors: [
                {
                    message: 'TODO',
                },
            ],
        },
        {
            code: `export { default } from 'adapter';`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'default' }],
                },
            ],
            errors: [
                {
                    message: 'TODO',
                },
            ],
        },
    ],
});
