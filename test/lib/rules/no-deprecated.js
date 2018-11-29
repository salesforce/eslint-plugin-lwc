'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-deprecated');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-deprecated', rule, {
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
