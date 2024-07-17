/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('valid-graphql-wire-adapter-callback-parameters', {
    valid: [
        {
            code: `import { LightningElement, api } from 'lwc';
            export default class Foo extends LightningElement {
                @api bar_Foo() {}
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';
            
            class Test {
                @wire(getFoo)
                wiredMethod() {}
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import { gql, graphql } from 'lightning/uiGraphQLApi';
            
            class Test {
                @wire(graphql, {})
                wiredMethod({errors, data}) {}
            }`,
        },
        {
            code: `
                class C {
                    f({ error }) {
                        return error;
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `import { wire } from 'lwc';
            import { gql, graphql } from 'lightning/uiGraphQLApi';
            
            class Test {
                @wire(graphql, {})
                wiredMethod({error, data}) {}
            }`,
            errors: [
                {
                    message:
                        '@wire graphql callback function object must use "errors" instead of "error"',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { gql, graphql } from 'lightning/uiGraphQLApi';
            
            class Test {
                @wire(graphql, {})
                wiredMethod({error, errors, data}) {}
            }`,
            errors: [
                {
                    message:
                        '@wire graphql callback function object must use "errors" instead of "error"',
                },
            ],
        },
    ],
});

testTypeScript('valid-graphql-wire-adapter-callback-parameters', {
    valid: [
        {
            code: `import { LightningElement, api } from 'lwc';
            export default class Foo extends LightningElement {
                @api bar_Foo(): void {}
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';
            
            class Test {
                @wire(getFoo)
                wiredMethod(): void {}
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import { gql, graphql } from 'lightning/uiGraphQLApi';
            
            class Test {
                @wire(graphql, {})
                wiredMethod({errors, data}: Record<string, any>): void {}
            }`,
        },
        {
            code: `
                class C {
                    f({ error }) {
                        return error;
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `import { wire } from 'lwc';
            import { gql, graphql } from 'lightning/uiGraphQLApi';
            
            class Test {
                @wire(graphql, {})
                wiredMethod({error, data}: Record<string, any>): void {}
            }`,
            errors: [
                {
                    message:
                        '@wire graphql callback function object must use "errors" instead of "error"',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import { gql, graphql } from 'lightning/uiGraphQLApi';
            
            class Test {
                @wire(graphql, {})
                wiredMethod({error, errors, data}: Record<string, any>): void {}
            }`,
            errors: [
                {
                    message:
                        '@wire graphql callback function object must use "errors" instead of "error"',
                },
            ],
        },
    ],
});
