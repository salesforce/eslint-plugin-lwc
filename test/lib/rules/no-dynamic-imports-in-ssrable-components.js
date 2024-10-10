/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-dynamic-imports-in-ssrable-components', {
    valid: [
        {
            code: `import { LightningElement } from 'lwc';
                   
                   class MyComponent extends LightningElement {
                
                   connectedCallback() {
                        // No dynamic import
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                class MyComponent extends LightningElement {
                    connectedCallback() {
                        import('@salesforce/user/Id').then((module) => {
                            console.log(module);
                        });
                    }
                }
            `,
            errors: [
                {
                    message:
                        'The recommended declarative solution is to use a [data provider](https://developer.salesforce.com/docs/platform/lwr/guide/lwr-data-providers.html) to fetch this information. The dynamic import approach shown below is considered an anti-pattern and should be avoided.',
                },
            ],
        },
    ],
});

testTypeScript('no-dynamic-imports-in-ssrable-components', {
    valid: [
        {
            code: `import { LightningElement } from 'lwc';
                   
                   class MyComponent extends LightningElement {
                
                   connectedCallback() {
                        // No dynamic import
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                class MyComponent extends LightningElement {
                    connectedCallback() {
                        import('@salesforce/user/Id').then((module) => {
                            console.log(module);
                        });
                    }
                }
            `,
            errors: [
                {
                    message:
                        'The recommended declarative solution is to use a [data provider](https://developer.salesforce.com/docs/platform/lwr/guide/lwr-data-providers.html) to fetch this information. The dynamic import approach shown below is considered an anti-pattern and should be avoided.',
                },
            ],
        },
    ],
});
