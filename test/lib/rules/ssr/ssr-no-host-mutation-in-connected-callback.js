/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../../shared');

testRule('ssr/ssr-no-host-mutation-in-connected-callback', {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Cmp extends LightningElement {
                    @api fromOutside;
                    get theClassMyChildNeeds() {
                        return \`my-child-needs-\${this.fromOutside}\`;
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Cmp extends LightningElement {
                    @api fromOutside;
                    get customAttributes() {
                        return { class: \`my-child-\${this.fromOutside}\` };
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Cmp extends LightningElement {
                    connectedCallback() {
                        if(!import.meta.env.SSR){
                            this.setAttribute('class', \`my-child-\${this.fromOutside}\`);
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
                export default class Cmp extends LightningElement {
                    connectedCallback() {
                        this.setAttribute('class', \`my-child-\${this.fromOutside}\`);
                    }
                }
            `,
            errors: [
                {
                    message: 'Mutations to the host element in connectedCallback are not allowed.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Cmp extends LightningElement {
                    connectedCallback() {
                        this.classList.add(\`my-child-needs-\${this.fromOutside}\`);
                    }
                }
            `,
            errors: [
                {
                    message: 'Mutations to the host element in connectedCallback are not allowed.',
                },
            ],
        },
    ],
});

testTypeScript('ssr/ssr-no-host-mutation-in-connected-callback', {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Cmp extends LightningElement {
                    @api fromOutside: string;
                    get theClassMyChildNeeds(): string {
                        return \`my-child-needs-\${this.fromOutside}\`;
                    }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Cmp extends LightningElement {
                    @api fromOutside: string;
                    get customAttributes(): { class: string } {
                        return { class: \`my-child-\${this.fromOutside}\` };
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Cmp extends LightningElement {
                    connectedCallback() {
                        this.setAttribute('class', \`my-child-\${this.fromOutside}\`);
                    }
                }
            `,
            errors: [
                {
                    message: 'Mutations to the host element in connectedCallback are not allowed.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Cmp extends LightningElement {
                    connectedCallback() {
                        this.classList.add(\`my-child-needs-\${this.fromOutside}\`);
                    }
                }
            `,
            errors: [
                {
                    message: 'Mutations to the host element in connectedCallback are not allowed.',
                },
            ],
        },
    ],
});
