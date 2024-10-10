/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-form-factor-in-ssrable-components', {
    valid: [
        {
            code: `import { LightningElement } from 'lwc';
                   
                   class MyComponent extends LightningElement {
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import { formFactor } from '@salesforce/client/formFactor';

                export default class MyComponent extends LightningElement {
                    connectedCallback() {
                        console.log(formFactor);
                    }
                }
            `,
            errors: [
                {
                    message:
                        "Avoid using '@salesforce/client/formFactor' in SSR-able components. For best practices, refer to: https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/%40lwrjs/lwc-ssr/best_practices.md#form-factor.",
                },
            ],
        },
    ],
});

testTypeScript('no-form-factor-in-ssrable-components', {
    valid: [
        {
            code: `import { LightningElement } from 'lwc';
                   
                   class MyComponent extends LightningElement {
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import { formFactor } from '@salesforce/client/formFactor';

                export default class MyComponent extends LightningElement {
                    connectedCallback() {
                        console.log(formFactor);
                    }
                }
            `,
            errors: [
                {
                    message:
                        "Avoid using '@salesforce/client/formFactor' in SSR-able components. For best practices, refer to: https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/%40lwrjs/lwc-ssr/best_practices.md#form-factor.",
                },
            ],
        },
    ],
});
