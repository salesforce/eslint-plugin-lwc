/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-restricted-browser-globals-during-ssr');

const tester = new RuleTester(ESLINT_TEST_CONFIG);

tester.run('no-browser-globals-during-ssr', rule, {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  renderedCallback() {
                    window.foo = true;
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
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    window.foo = true;
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
                    // we can't use window here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(window);
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
                    // we can't use window here
                  }
                  bar() {
                    doSomething(window);
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function notInvokedDuringSSR() {
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
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
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
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
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
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

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(typeof document !== 'undefined') {
                    window.x = 1;
                  }
                }
              }
          `,
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(typeof window !== 'undefined') {
                    window.x = 1;
                  }
                }
              }
          `,
        },
        { code: `const f = new Foo();` },
        { code: `const name = new Foo();` },
        {
            code: `
              let screen = 'mobile';
              export default class Foo extends LightningElement {
                connectedCallback() {
                  let name = "hello";
                  screen;
                }
              }
            `,
        },
        {
            code: `
              import { name } from 'some/component';
              export default class Foo extends LightningElement {
                connectedCallback() {
                  name();
                }
              }
          `,
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';

                document.futzAround();
            `,
            errors: [
                {
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                {
                  document.futzAround();
                }
            `,
            errors: [
                {
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function writer() {
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    window.foo = true;
                  }
                }
            `,
            errors: [
                {
                    message: '`window`, like most browser APIs, is not accessible during SSR.',
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
                    window.bar = true;
                  }
                }
            `,
            errors: [
                {
                    message: '`window`, like most browser APIs, is not accessible during SSR.',
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
                    doSomethingWith(window);
                  }
                }
            `,
            errors: [
                {
                    message: '`window`, like most browser APIs, is not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(window);
                  }
                }
            `,
            errors: [
                {
                    message: '`window`, like most browser APIs, is not accessible during SSR.',
                },
            ],
        },
    ],
});
