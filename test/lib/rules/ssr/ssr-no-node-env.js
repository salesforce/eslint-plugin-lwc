/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testSsrRule, SSR_DISABLED_FILE } = require('../../shared');

// TODO: Type assertions break this rule

testSsrRule('ssr/ssr-no-node-env', {
    valid: [
        {
            // A component without an SSR capability is not linted, even when it would
            // otherwise report: the meta-xml gate keeps the rule from running.
            filename: SSR_DISABLED_FILE,
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
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
              constructor() {
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
              constructor() {
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
              foo = process.env.NODE_ENV;              
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
