/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-unexpected-wire-adapter-usages');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-unexpected-wire-adapter-usages', rule, {
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
        {
            code: `import { getBar } from 'adapter';
            getBar();`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
        },
    ],
    invalid: [
        {
            code: `import { getFoo } from 'adapter';
            getFoo();`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
                },
            ],
            errors: [
                {
                    message:
                        '"getFoo" is a wire adapter and can only be used via the @wire decorator.',
                },
            ],
        },
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
                    message:
                        '"getFoo" is a wire adapter and can only be used via the @wire decorator.',
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
                    message:
                        '"getFoo" is a wire adapter and can only be used via the @wire decorator.',
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
                    message:
                        '"getFoo" is a wire adapter and can only be used via the @wire decorator.',
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
                    message:
                        '"getFoo" is a wire adapter and can only be used via the @wire decorator.',
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
                    message:
                        '"getFoo" is a wire adapter and can only be used via the @wire decorator.',
                },
            ],
        },
    ],
});
