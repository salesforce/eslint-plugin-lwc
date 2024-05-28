/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

testRule('no-attributes-during-construction', {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                let tabIndex;
                class Test extends LightningElement {
                    tabIndex = '-1';
                    constructor() {
                        super();
                        tabIndex = '0';
                    }
                }
            `,
        },
        {
            code: `
                class LightningElement {}
                class Test extends LightningElement {
                    constructor() {
                        super();
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
                        super();
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
                        super();
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
                        super();
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
                        super();
                        this.role = ['test'];
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                class Test extends LightningElement {
                    get role() {}
                    constructor() {
                        super();
                        this.role = 'test';
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                class Test extends LightningElement {
                    set hidden(val) {}
                    constructor() {
                        super();
                        this.hidden = 'test';
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                const foo = {};
                class Test extends LightningElement {
                    constructor() {
                        super();
                        foo.hidden = 'test';
                    }
                }
            `,
        },
        {
            code: `
                import { api } from 'lwc';
                import MyLightningElement from './my-lightning-element';
                class Test extends MyLightningElement {
                    constructor() {
                        super();
                        this.title = 'test';
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
                        super();
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
                    line: 6,
                },
            ],
        },
        {
            code: `
                import { LightningElement as Component } from 'lwc';
                class Test extends Component {
                    constructor() {
                        super();
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
                    line: 6,
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                class Test extends LightningElement {
                    constructor() {
                        super();
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
                    line: 6,
                },
            ],
        },
        {
            code: `
                import { track, LightningElement } from 'lwc';
                class Test extends LightningElement {
                    constructor() {
                        super();
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
                    line: 6,
                },
            ],
        },
    ],
});
