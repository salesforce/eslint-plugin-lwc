/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-attributes-during-construction');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-attributes-during-construction', rule, {
    valid: [
        {
            code: `
                class LightningElement {}
                class Test extends LightningElement {
                    constructor() {
                        this.tabIndex = '0';
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                class Test extends LightningElement {
                    tabIndex;
                    constructor() {
                        this.tabIndex = '0';
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement as Component } from 'lwc';
                class Test extends Component {
                    title;
                    constructor() {
                        this.title = 'test';
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                class Test extends LightningElement {
                    ariaDescribedBy = 'foo';
                    constructor() {
                        this.ariaDescribedBy = 'test';
                    }
                }
            `,
        },
        {
            code: `
                import { track, LightningElement } from 'lwc';
                class Test extends LightningElement {
                    @track role = [];
                    constructor() {
                        this.role = ['test'];
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                class Test extends LightningElement {
                    constructor() {
                        this.tabIndex = '0';
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Invariant violation: Setting "tabIndex" in the constructor results in a rendered attribute during construction. Change the name of this property, move this assignment to another lifecycle method, or override the default behavior by defining "tabIndex" as a property on the class.',
                    type: 'AssignmentExpression',
                    column: 25,
                    line: 5,
                },
            ],
        },
        {
            code: `
                import { LightningElement as Component } from 'lwc';
                class Test extends Component {
                    constructor() {
                        this.title = 'test';
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Invariant violation: Setting "title" in the constructor results in a rendered attribute during construction. Change the name of this property, move this assignment to another lifecycle method, or override the default behavior by defining "title" as a property on the class.',
                    type: 'AssignmentExpression',
                    column: 25,
                    line: 5,
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                class Test extends LightningElement {
                    constructor() {
                        this.ariaDescribedBy = 'test';
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Invariant violation: Setting "ariaDescribedBy" in the constructor results in a rendered attribute during construction. Change the name of this property, move this assignment to another lifecycle method, or override the default behavior by defining "ariaDescribedBy" as a property on the class.',
                    type: 'AssignmentExpression',
                    column: 25,
                    line: 5,
                },
            ],
        },
        {
            code: `
                import { track, LightningElement } from 'lwc';
                class Test extends LightningElement {
                    constructor() {
                        this.role = ['test'];
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Invariant violation: Setting "role" in the constructor results in a rendered attribute during construction. Change the name of this property, move this assignment to another lifecycle method, or override the default behavior by defining "role" as a property on the class.',
                    type: 'AssignmentExpression',
                    column: 25,
                    line: 5,
                },
            ],
        },
    ],
});
