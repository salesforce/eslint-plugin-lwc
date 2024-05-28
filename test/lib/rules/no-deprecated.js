/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-deprecated', {
    valid: [
        {
            code: `class Component {
                    static observedAttributes = [];
                }`,
        },
        {
            code: `class Component {
                    static get observedAttributes() {
                        return [];
                    }
                }`,
        },
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    observedAttributes;
                }`,
        },
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    attributeChangedCallback;
                }`,
        },
    ],
    invalid: [
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    static observedAttributes = [];
                }`,
            errors: [
                {
                    message: /^"observedAttributes" has been deprecated./,
                },
            ],
        },
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    static get observedAttributes() {
                        return [];
                    }
                }`,
            errors: [
                {
                    message: /^"observedAttributes" has been deprecated./,
                },
            ],
        },
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    attributeChangedCallback(name, prev, next) {}
                }`,
            errors: [
                {
                    message: /^"attributeChangedCallback" has been deprecated./,
                },
            ],
        },
    ],
});

testTypeScript('no-deprecated', {
    valid: [
        {
            code: `class Component {
                    static observedAttributes: any[] = [];
                }`,
        },
        {
            code: `class Component {
                    static get observedAttributes(): any[] {
                        return [];
                    }
                }`,
        },
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    observedAttributes: unknown[];
                }`,
        },
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    attributeChangedCallback: Function;
                }`,
        },
    ],
    invalid: [
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    static observedAttributes: unknown[] = [];
                }`,
            errors: [
                {
                    message: /^"observedAttributes" has been deprecated./,
                },
            ],
        },
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    static get observedAttributes(): unknown[] {
                        return [];
                    }
                }`,
            errors: [
                {
                    message: /^"observedAttributes" has been deprecated./,
                },
            ],
        },
        {
            code: `import { LightningElement } from 'lwc';
                export default class extends LightningElement {
                    attributeChangedCallback(name, prev, next): void {}
                }`,
            errors: [
                {
                    message: /^"attributeChangedCallback" has been deprecated./,
                },
            ],
        },
    ],
});
