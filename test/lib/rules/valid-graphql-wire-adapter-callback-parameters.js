/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/valid-graphql-wire-adapter-callback-parameters');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('valid-graphql-wire-adapter-callback-parameters', rule, {
    valid: [
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
    ],
});
