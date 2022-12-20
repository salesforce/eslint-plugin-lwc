/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-document-during-ssr');

const tester = new RuleTester(ESLINT_TEST_CONFIG);

tester.run('no-document-during-ssr', rule, {
    valid: [
        {
            code: `
                class RandomClass {
                    constructor() {
                      document.write("hello");
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  renderedCallback() {
                    document.foo = true;
                  }
                  bar() {
                    this.template.classList.add('foo');
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    document.foo = true;
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(document);
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  bar() {
                    doSomething(document);
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                function notInvokedDuringSSR() {
                  document.futzAround();
                }
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  bar() {
                    notInvokedDuringSSR();
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                function notInvokedDuringSSR() {
                  document.futzAround();
                }
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  renderedCallback() {
                    notInvokedDuringSSR();
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                function notInvokedDuringSSR() {
                  document.futzAround();
                }
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    notInvokedDuringSSR();
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                const notInvokedDuringSSR = function () {
                  document.futzAround();
                }
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    notInvokedDuringSSR();
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                const notInvokedDuringSSR = () => {
                  document.futzAround();
                }
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    notInvokedDuringSSR();
                  }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    document.foo = true;
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  foo() {
                    document.bar = true;
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  foo() {
                    doSomethingWith(document);
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(document);
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                function invokedDuringSSR() {
                  document.futzAround();
                }
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    invokedDuringSSR();
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                document.futzAround();
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                {
                  document.futzAround();
                }
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                for (const thing of things) {
                  document.futzAround(thing);
                }
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                const writer = function() {
                  document.write("Hello world")
                };
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    writer();
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
        
                const writer = () => {
                  document.write("Hello world")
                };
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    writer();
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access `document` in methods that will execute during SSR.',
                },
            ],
        },
    ],
});
