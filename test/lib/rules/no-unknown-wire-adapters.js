/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-unknown-wire-adapters');

const DEFAULT_OPTIONS = [
    {
        adapters: [],
    },
];

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-unknown-wire-adapters', rule, {
    valid: [
        {
            // "valid-wire" rule already covers invalid @wires decorators. We need to make sure that
            // this rule doesn't error out when processing invalid @wire decorators.
            code: `class Test {
                @foo
                foo;

                @wire
                wiredPropA;

                @wire()
                wiredPropB;

                @wire({})
                wiredPropC;
            }`,
            options: DEFAULT_OPTIONS,
        },
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
            code: `import { wire } from 'lwc';
            import getFoo, { getBar } from 'adapter';

            class Test {
                @wire(getFoo)
                wiredFoo;

                @wire(getBar)
                wiredBar;
            }`,
            options: [
                {
                    adapters: [
                        { module: 'adapter', identifier: 'default' },
                        { module: 'adapter', identifier: 'getBar' },
                    ],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapterFoo';
            import { getBar } from 'adapterBar';

            class Test {
                @wire(getFoo)
                wiredFoo;

                @wire(getBar)
                wiredBar;
            }`,
            options: [
                {
                    adapters: [
                        { module: 'adapterFoo', identifier: 'getFoo' },
                        { module: 'adapterBar', identifier: 'getBar' },
                    ],
                },
            ],
        },
    ],
    invalid: [
        {
            code: `import { wire } from 'lwc';

            class Test {
                @wire(getFoo) wiredProp;
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" is not a known adapter.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';

            const getFoo = () => {};

            class Test {
                @wire(getFoo) wiredProp;
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" is not a known adapter.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import * as getFoo from 'adapter';

            class Test {
                @wire(getFoo) wiredProp;
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" is not a known adapter.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo) wiredProp;
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getBar' }],
                },
            ],
            errors: [
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                },
            ],
        },
    ],
});
