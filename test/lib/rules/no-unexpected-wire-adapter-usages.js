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
        {
            // Caveat: namespace imports
            code: `import * as adapters from 'adapter';
            adapters.getFoo();`,
            options: [
                {
                    adapters: [{ module: 'adapter', identifier: 'getFoo' }],
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
        // matches multiple modules, but not the given identifier
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
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apex/Continuation/SampleContinuationClass.startRequest';
            startRequest();

            class Test {
                @wire(startRequest) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/*', identifier: '*' }],
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getCartSummary } from '@salesforce/commerce/cartApiInternal';
            getCartSummary();

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
            wire(getFoo);`,
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
                @wire({}, getFoo)
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
        // matches multiple identifiers, but only one module
        {
            code: `import { wire } from 'lwc';
            import { fooMethod } from '@salesforce/apex/Foo.Namespace';

            class Test {
                @wire(fooMethod)
                wiredValue;

                aMethod() {
                    fooMethod();
                }
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/Foo.Namespace', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"fooMethod" is a wire adapter and can only be used via the @wire decorator.',
                    line: 9,
                    column: 21,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apex/Continuation/SampleContinuationClass.startRequest';
            startRequest();

            class Test {
                @wire(startRequest) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex/**', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"startRequest" is a wire adapter and can only be used via the @wire decorator.',
                    line: 3,
                    column: 13,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import startRequest from '@salesforce/apexContinuation/SampleContinuationClass.startRequest';
            startRequest();

            class Test {
                @wire(startRequest) wiredProp;
            }`,
            options: [
                {
                    adapters: [{ module: '@salesforce/apex*/*', identifier: '*' }],
                },
            ],
            errors: [
                {
                    message:
                        '"startRequest" is a wire adapter and can only be used via the @wire decorator.',
                    line: 3,
                    column: 13,
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { getCartSummary } from '@salesforce/commerce/cartApi';
            getCartSummary();

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
                        '"getCartSummary" is a wire adapter and can only be used via the @wire decorator.',
                    line: 3,
                    column: 13,
                },
            ],
        },
    ],
});
