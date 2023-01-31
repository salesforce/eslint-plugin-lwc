/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-this-property-during-ssr');

const tester = new RuleTester(ESLINT_TEST_CONFIG);
tester.run('no-this-property-during-ssr', rule, {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use this.template here
                  }
                  renderedCallback() {
                    this.template.querySelector('span')?.foo();
                  }
                  bar() {
                    this.template.querySelector('span')?.foo();
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
                    // we can't use this.template here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    this.template.querySelector('span')?.foo();
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
                    // we can't use this.template here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(this.template);
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
                    // we can't use this.template here
                  }
                  bar() {
                    doSomething(this.template);
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    if(document !== undefined) {
                      doSomething(this.template);
                    }
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
                    this.template.querySelector('span')?.foo();
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any properties on `this` in methods that will execute during SSR.',
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
                    this.template.querySelector('span')?.foo();
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any properties on `this` in methods that will execute during SSR.',
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
                    doSomethingWith(this.template);
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any properties on `this` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(this.template);
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any properties on `this` in methods that will execute during SSR.',
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
                    doSomethingWith(this.template);
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any properties on `this` in methods that will execute during SSR.',
                },
            ],
        },
    ],
});
