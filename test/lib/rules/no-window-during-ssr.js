/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-window-during-ssr');

const tester = new RuleTester(ESLINT_TEST_CONFIG);

tester.run('no-window-during-ssr', rule, {
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
    ],
    invalid: [
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
                    message:
                        'You should not access `window` in methods that will execute during SSR.',
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
                    message:
                        'You should not access `window` in methods that will execute during SSR.',
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
                    message:
                        'You should not access `window` in methods that will execute during SSR.',
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
                    message:
                        'You should not access `window` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
        import { LightningElement } from 'lwc';

        window.futzAround();

        export default class Foo extends LightningElement {
          connectedCallback() {
            // we can't use window here
          }
        }
      `,
            errors: [
                {
                    message:
                        'You should not access `window` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
        import { LightningElement } from 'lwc';

        {
          window.futzAround();
        }
        export default class Foo extends LightningElement {
          connectedCallback() {
            // we can't use window here
          }
        }
      `,
            errors: [
                {
                    message:
                        'You should not access `window` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
        import { LightningElement } from 'lwc';

        for (const thing of things) {
          window.futzAround(thing);
        }

        export default class Foo extends LightningElement {
          connectedCallback() {
            // we can't use window here
          }
        }
      `,
            errors: [
                {
                    message:
                        'You should not access `window` in methods that will execute during SSR.',
                },
            ],
        },
    ],
});
