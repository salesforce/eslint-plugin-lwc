/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

const DEFAULT_OPTIONS = [
    {
        adapters: [],
    },
];

testRule('no-unknown-wire-adapters', {
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
        {
            code: `import { wire } from 'lwc';
            import { apexMethod } from '@salesforce/apex/Namespace.Classname.apexMethodReference';

            class Test {
                @wire(apexMethod)
                wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/*', identifier: '*' }],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapterFoo';
            import { apexMethod } from '@salesforce/apex/Namespace.Classname.apexMethodReference';

            class Test {
                @wire(apexMethod)
                wiredProp;
                
                @wire(getFoo)
                wiredFoo;
            }`,
            options: [
                {
                    adapters: [
                        { module: 'adapterFoo', identifier: 'getFoo' },
                        { module: '@salesforce/apex/*', identifier: '*' },
                    ],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apexContinuation/SampleContinuationClass.startRequest';

            class Test {
                @wire(startRequest) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/**', identifier: '*' }],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getCartSummary } from '@salesforce/commerce/cartApi';

            class Test {
                @wire(getCartSummary)
                wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/commerce/*Api!(Internal)', identifier: '*' }],
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
                    line: 4,
                    column: 23,
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
                    line: 5,
                    column: 23,
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
                    line: 5,
                    column: 23,
                },
            ],
        },
        // reports multiple occurrences
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo) wiredProp;
                
                @wire(getFoo)
                wiredMethod() {}
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                    line: 7,
                    column: 23,
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
                    line: 5,
                    column: 23,
                },
            ],
        },
        // verify matches is not using includes.
        {
            code: `import { wire } from 'lwc';
            import { getPost } from 'adapter';

            class Test {
                @wire(getPost) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getPosts' }],
                },
            ],
            errors: [
                {
                    message: '"getPost" from "adapter" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        // code sensitive.
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getfoo' }],
                },
            ],
            errors: [
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        // matches multiple module, but not identifier
        {
            code: `import { wire } from 'lwc';
            import { apexMethod } from '@salesforce/apex/Namespace.Classname.apexMethodReference';

            class Test {
                @wire(apexMethod)
                wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/*', identifier: 'default' }],
                },
            ],
            errors: [
                {
                    message:
                        '"apexMethod" from "@salesforce/apex/Namespace.Classname.apexMethodReference" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        // matches multiple identifiers, but only one module.
        {
            code: `import { wire } from 'lwc';
            import { apexMethod } from '@salesforce/apex/Namespace.Classname.apexMethodReference';
            import { fooMethod } from '@salesforce/apex/Foo.Namespace';

            class Test {
                @wire(apexMethod)
                wiredProp;
                
                @wire(fooMethod)
                wiredValue;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/Foo.Namespace', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"apexMethod" from "@salesforce/apex/Namespace.Classname.apexMethodReference" is not a known adapter.',
                    line: 6,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apex/Continuation/SampleContinuationClass.startRequest';

            class Test {
                @wire(startRequest) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/*', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"startRequest" from "@salesforce/apex/Continuation/SampleContinuationClass.startRequest" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apexContinuation/SampleContinuationClass.startRequest';

            class Test {
                @wire(startRequest) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex*', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"startRequest" from "@salesforce/apexContinuation/SampleContinuationClass.startRequest" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getCartSummary } from '@salesforce/commerce/cartApiInternal';

            class Test {
                @wire(getCartSummary)
                wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/commerce/*Api!(Internal)', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"getCartSummary" from "@salesforce/commerce/cartApiInternal" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
    ],
});

testTypeScript('no-unknown-wire-adapters', {
    valid: [
        {
            // "valid-wire" rule already covers invalid @wires decorators. We need to make sure that
            // this rule doesn't error out when processing invalid @wire decorators.
            code: `class Test {
                @foo
                public foo: string;

                @wire
                public wiredPropA: string;

                @wire()
                public wiredPropB: string;

                @wire({})
                public wiredPropC: string;
            }`,
            options: DEFAULT_OPTIONS,
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo)
                public wiredProp: string;
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
                public wiredProp: string;
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
                public wiredProp: string;
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
                public wiredFoo: string;

                @wire(getBar)
                public wiredBar: string;
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
                public wiredFoo: string;

                @wire(getBar)
                public wiredBar: string;
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
        {
            code: `import { wire } from 'lwc';
            import { apexMethod } from '@salesforce/apex/Namespace.Classname.apexMethodReference';

            class Test {
                @wire(apexMethod)
                public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/*', identifier: '*' }],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapterFoo';
            import { apexMethod } from '@salesforce/apex/Namespace.Classname.apexMethodReference';

            class Test {
                @wire(apexMethod)
                public wiredProp: string;
                
                @wire(getFoo)
                public wiredFoo: string;
            }`,
            options: [
                {
                    adapters: [
                        { module: 'adapterFoo', identifier: 'getFoo' },
                        { module: '@salesforce/apex/*', identifier: '*' },
                    ],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apexContinuation/SampleContinuationClass.startRequest';

            class Test {
                @wire(startRequest) public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/**', identifier: '*' }],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getCartSummary } from '@salesforce/commerce/cartApi';

            class Test {
                @wire(getCartSummary)
                public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/commerce/*Api!(Internal)', identifier: '*' }],
                },
            ],
        },
    ],
    invalid: [
        {
            code: `import { wire } from 'lwc';

            class Test {
                @wire(getFoo) public wiredProp: string;
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" is not a known adapter.',
                    line: 4,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';

            const getFoo = () => {};

            class Test {
                @wire(getFoo) public wiredProp: string;
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
                @wire(getFoo) public wiredProp: string;
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo) public wiredProp: string;
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        // reports multiple occurrences
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo) public wiredProp: string;
                
                @wire(getFoo)
                public wiredMethod(): void {}
            }`,
            options: DEFAULT_OPTIONS,
            errors: [
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                    line: 7,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo) public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getBar' }],
                },
            ],
            errors: [
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        // verify matches is not using includes.
        {
            code: `import { wire } from 'lwc';
            import { getPost } from 'adapter';

            class Test {
                @wire(getPost) public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getPosts' }],
                },
            ],
            errors: [
                {
                    message: '"getPost" from "adapter" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        // code sensitive.
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo) public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getfoo' }],
                },
            ],
            errors: [
                {
                    message: '"getFoo" from "adapter" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        // matches multiple module, but not identifier
        {
            code: `import { wire } from 'lwc';
            import { apexMethod } from '@salesforce/apex/Namespace.Classname.apexMethodReference';

            class Test {
                @wire(apexMethod)
                public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/*', identifier: 'default' }],
                },
            ],
            errors: [
                {
                    message:
                        '"apexMethod" from "@salesforce/apex/Namespace.Classname.apexMethodReference" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        // matches multiple identifiers, but only one module.
        {
            code: `import { wire } from 'lwc';
            import { apexMethod } from '@salesforce/apex/Namespace.Classname.apexMethodReference';
            import { fooMethod } from '@salesforce/apex/Foo.Namespace';

            class Test {
                @wire(apexMethod)
                public wiredProp: string;
                
                @wire(fooMethod)
                public wiredValue: string;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/Foo.Namespace', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"apexMethod" from "@salesforce/apex/Namespace.Classname.apexMethodReference" is not a known adapter.',
                    line: 6,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apex/Continuation/SampleContinuationClass.startRequest';

            class Test {
                @wire(startRequest) public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/*', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"startRequest" from "@salesforce/apex/Continuation/SampleContinuationClass.startRequest" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apexContinuation/SampleContinuationClass.startRequest';

            class Test {
                @wire(startRequest) public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex*', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"startRequest" from "@salesforce/apexContinuation/SampleContinuationClass.startRequest" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getCartSummary } from '@salesforce/commerce/cartApiInternal';

            class Test {
                @wire(getCartSummary)
                public wiredProp: string;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/commerce/*Api!(Internal)', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"getCartSummary" from "@salesforce/commerce/cartApiInternal" is not a known adapter.',
                    line: 5,
                    column: 23,
                },
            ],
        },
    ],
});
