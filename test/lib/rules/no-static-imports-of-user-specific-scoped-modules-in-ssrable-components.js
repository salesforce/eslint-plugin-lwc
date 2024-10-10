/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-static-imports-of-user-specific-scoped-modules-in-ssrable-components', {
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
                import userId from '@salesforce/user/Id';

                export default class Foo extends LightningElement {
                    connectedCallback() {
                        console.log(userId);
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Static import of @salesforce user-specific scoped modules is not allowed in SSR-able components. For more information, refer to https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/%40lwrjs/lwc-ssr/best_practices.md#user-specific-scoped-modules.',
                },
            ],
        },
    ],
});

testTypeScript('no-static-imports-of-user-specific-scoped-modules-in-ssrable-components', {
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
                import userId from '@salesforce/user/Id';

                export default class Foo extends LightningElement {
                    connectedCallback() {
                        console.log(userId);
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Static import of @salesforce user-specific scoped modules is not allowed in SSR-able components. For more information, refer to https://github.com/salesforce-experience-platform-emu/lwr/blob/main/packages/%40lwrjs/lwc-ssr/best_practices.md#user-specific-scoped-modules.',
                },
            ],
        },
    ],
});
