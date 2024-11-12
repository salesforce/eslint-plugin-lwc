/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../../shared');

testRule('ssr/no-form-factor', {
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
                        "Avoid using '@salesforce/client/formFactor' in SSR-able components. For best practices, to prevent UI shifting on page load, utilize [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries). For images, use [responsive image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) techniques to embed the appropriate image source for various form factors.",
                },
            ],
        },
    ],
});

testTypeScript('ssr/no-form-factor', {
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
                        "Avoid using '@salesforce/client/formFactor' in SSR-able components. For best practices, to prevent UI shifting on page load, utilize [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries). For images, use [responsive image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) techniques to embed the appropriate image source for various form factors.",
                },
            ],
        },
    ],
});
