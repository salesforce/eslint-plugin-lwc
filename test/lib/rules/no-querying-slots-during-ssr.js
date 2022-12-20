/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-querying-slots-during-ssr');

const tester = new RuleTester(ESLINT_TEST_CONFIG);

tester.run('no-querying-slots-during-ssr', rule, {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use this here
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
                    // we can't use this here
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
                    // we can't use this here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(this.querySelectorAll.bind(this));
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
                    // we can't use this here
                  }
                  bar() {
                    doSomething(this.querySelectorAll.bind(this));
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
                    message: 'You should not query slots in methods that will execute during SSR.',
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
                    this.querySelectorAll('span')?.[0]?.foo();
                  }
                }
            `,
            errors: [
                {
                    message: 'You should not query slots in methods that will execute during SSR.',
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
                    doSomethingWith(this.querySelectorAll.bind(this));
                  }
                }
            `,
            errors: [
                {
                    message: 'You should not query slots in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';
        
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(this.querySelector.bind(this));
                  }
                }
            `,
            errors: [
                {
                    message: 'You should not query slots in methods that will execute during SSR.',
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
                    doSomethingWith(this.querySelector.bind(this));
                  }
                }
            `,
            errors: [
                {
                    message: 'You should not query slots in methods that will execute during SSR.',
                },
            ],
        },
    ],
});
