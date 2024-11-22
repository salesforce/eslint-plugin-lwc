/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

// TODO: Type assertions break this rule

testRule('no-unsupported-ssr-properties', {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use this.querySelector here
                  }
                  renderedCallback() {
                    this.querySelector('span')?.foo();
                  }
                  bar() {
                    this.querySelector('span')?.foo();
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
                    // we can't use this.querySelector here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    this.querySelector('span')?.foo();
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
                    // we can't use this.lastChild here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(this.lastChild);
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
                    // we can't use this.ownerDocument here
                  }
                  bar() {
                    doSomething(this.ownerDocument);
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
                      doSomething(this.lastElementChild);
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
                    if (!import.meta.env.SSR) {
                      this.querySelector('span').getAttribute('role');
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
                    if (!import.meta.env.SSR && !randomOtherCheck) {
                      this.querySelector('span').getAttribute('role');
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
                  if (!import.meta.env.SSR && randomOtherCheck) {
                    this.querySelector('span').getAttribute('role');
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
                  if (randomOtherCheck && !import.meta.env.SSR) {
                    this.querySelector('span').getAttribute('role');
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
                  if (!a && b && !c && d && !import.meta.env.SSR) {
                    this.querySelector('span').getAttribute('role');
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
                  if (a && (b && !import.meta.env.SSR)) {
                    this.querySelector('span').getAttribute('role');
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
                  return isCSR ? this.template.querySelector('button') : null;
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
                    this.querySelector('span')?.foo();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                    this.querySelectorAll('span')?.foo();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                    doSomethingWith(this.lastChild);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(this.dispatchEvent);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                    doSomethingWith(this.getBoundingClientRect);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                  doSomethingWith(this.querySelector);
                }
              }
          `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
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
                  doSomethingWith(this.querySelectorAll);
                }
              }
          `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span').foo();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span')?.getAttribute('role');
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span')?.firstElementChild?.id;
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span').getAttribute('role');
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span').getAttribute?.('role').startsWith('button');
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.querySelector?.('span')?.children?.item?.(0);
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.childNodes.item(0).textContent = 'foo';
                  }
                }
            `,
            errors: [
                {
                    messageId: 'propertyAccessFound',
                },
            ],
        },
        {
          code: `
            import { LightningElement } from 'lwc';
            
            export default class Foo extends LightningElement {
              connectedCallback() {
                if (!a && b && !c && d) {
                  this.querySelector('span').getAttribute('role');
                }
              }
            }
          `,
          errors: [
              {
                  messageId: 'propertyAccessFound',
              }
          ]
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if (a && (b || !import.meta.env.SSR)) {
                    this.querySelector('span').getAttribute('role');
                  }
                }
              }
          `,
          errors: [
            {
                messageId: 'propertyAccessFound',
            }
          ]
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if (a || (b || !import.meta.env.SSR)) {
                    this.querySelector('span').getAttribute('role');
                  }
                }
              }
          `,
          errors: [
            {
                messageId: 'propertyAccessFound',
            }
          ]
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if (a || (b && !import.meta.env.SSR)) {
                    this.querySelector('span').getAttribute('role');
                  }
                }
              }
          `,
          errors: [
            {
                messageId: 'propertyAccessFound',
            }
          ]
        },
    ],
});
