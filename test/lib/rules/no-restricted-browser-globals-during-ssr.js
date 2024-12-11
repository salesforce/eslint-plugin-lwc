/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

// TODO: Type assertions break this rule

testRule('no-restricted-browser-globals-during-ssr', {
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
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(!import.meta.env.SSR) {
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
              let name;
              let screen = 'mobile';
              export default class Foo extends LightningElement {
                connectedCallback() {
                  name = "hello";
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
        {
            code: `btoa('lwc');`,
        },
        {
            code: `document`,
            options: [{ 'restricted-globals': { document: false } }],
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              foo = globalThis.document?.x;
            }
          `,
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              constructor() {
                console.log(globalThis.document?.x);
              }
            }
          `,
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  globalThis.document?.addEventListener('click', () => {});
                }
              }
          `,
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  globalThis.addEventListener?.('click', () => {});
                }
              }
          `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(globalThis);
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    const list = [globalThis.DOMException];
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  get url() {
                    return globalThis.location?.href;
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  get url() {
                    return !import.meta.env.SSR ? globalThis.location.href : null;
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  get url() {
                    if (!import.meta.env.SSR) {
                      return globalThis.location.href;
                    }
                    return null;
                  }
                }
            `,
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                handleFocus() {
                  console.log(window.location.href);
                }
              }
            `,
        },
    ],
    invalid: [
        {
            code: `sample`,
            options: [{ 'restricted-globals': { sample: true } }],
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                document.futzAround();
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'foo' },
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'bar' },
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'window' },
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
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'window' },
                },
            ],
        },

        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(!import.meta.env.notSSR) {
                    window.x = 1;
                  }
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(!import.meta.notenv.SSR) {
                    window.x = 1;
                  }
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  if(!notimport.meta.env.SSR) {
                    window.x = 1;
                  }
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
        },
        {
            code: `
            import { LightningElement } from 'lwc';
            import tmplA from './a.html';

            export default class Foo extends LightningElement {
              constructor() {
                console.log(window.x);
              }
            }
        `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              foo = window.x;
            }
        `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              foo = globalThis.document.x;
            }
        `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'document', property: 'x' },
                },
            ],
        },
        {
            code: `
            import { LightningElement } from 'lwc';

            export default class Foo extends LightningElement {
              constructor() {
                console.log(globalThis.document.x);
              }
            }
        `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'document', property: 'x' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                url = window.location.href;
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                url = window.location?.href;
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                constructor() {
                  window.location.href = '/path';
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  document.addEventListener('click', () => {});
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  document?.addEventListener('click', () => {});
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'document' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  globalThis.document.addEventListener('click', () => {});
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'document', property: 'addEventListener' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  globalThis.addEventListener('click', () => {});
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'addEventListener' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  name = 'hello';
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'name' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                get url() {
                  return location.href;
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'location' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                get url() {
                  return window.location.href;
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
        },
        {
            code: `
              import { LightningElement } from 'lwc';

              export default class Foo extends LightningElement {
                get url() {
                  return globalThis.location.href;
                }
              }
          `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsageGlobal',
                    data: { identifier: 'location', property: 'href' },
                },
            ],
        },
        {
            code: `
                function utility() {
                  window.fuzzAround();
                }

                export default class Foo {
                  bar() {
                    utility();
                  }
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'fuzzAround' },
                },
            ],
        },
        {
            code: `addEventListener('resize', () => {});`,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'addEventListener' },
                },
            ],
        },
        {
            code: `
                function utility() {
                    console.log(window.x);
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'x' },
                },
            ],
        },
        {
            code: `
                function getAttributes(element) {
                    if (element instanceof Element) {
                        return element.getAttributeNames();
                    }
                    return [];
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'Element' },
                },
            ],
        },
        {
            code: `
                function getAttributes(element) {
                    return element instanceof Element ? element.getAttributeNames() : [];
                }
            `,
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'Element' },
                },
            ],
        },
        {
            code: `
                function getJson(response) {
                    if (response instanceof Response) {
                        return response.json();
                    }
                    return Promise.resolve();
                }
            `,
            options: [{ 'restricted-globals': { Response: true } }],
            errors: [
                {
                    messageId: 'prohibitedBrowserAPIUsage',
                    data: { identifier: 'Response' },
                },
            ],
        },
    ],
});
