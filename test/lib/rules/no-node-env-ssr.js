/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-node-env-in-ssr');

const tester = new RuleTester(ESLINT_TEST_CONFIG);

tester.run('no-node-env-in-ssr', rule, {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use process.env.NODE_ENV here
                  }
                  renderedCallback() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                  bar() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use process.env.NODE_ENV here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use process.env.NODE_ENV here
                  }
                  bar() {
                    doSomething(process.emv.NODE_ENV);
                  }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                }
            `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  foo() {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('test');
                    }
                  }
                }
            `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(process.env.NODE_ENV);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  renderedCallback() {
                    this.foo();
                  }
                  foo() {
                    doSomethingWith(process.env.NODE_ENV);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';
              import tmplA from './a.html';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  this.foo();
                }
                renderedCallback() {
                  this.foo();
                }
                foo() {
                  doSomethingWith(process.env.NODE_ENV);
                }
              }
          `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';
              import tmplA from './a.html';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  this.foo();
                }
                renderedCallbac() {
                  this.foo();
                }
                foo() {
                  doSomethingWith(process.env.NODE_ENV);
                }
              }
          `,
            errors: [
                {
                    messageId: 'nodeEnvFound',
                },
            ],
        },
    ],
});
