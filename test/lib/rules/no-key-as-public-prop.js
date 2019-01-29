/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-key-as-public-prop');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('valid-api', rule, {
    valid: [
        {
            code: `import { api } from 'lwc';
            class Foo {
                key;
            }`,
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                key = {};
            }`,
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                key = 1;
            }`,
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                key = "";
            }`,
        },
    ],
    invalid: [
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api
                key;
            }`,
            errors: [
                {
                    message: `"@api" decorators cannot be applied to property "key". The "key" is reserved for iterations and if used elsewhere will always evaluate to "undefined". Consider renaming this property.`,
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api key = "string";
            }`,
            errors: [
                {
                    message: `"@api" decorators cannot be applied to property "key". The "key" is reserved for iterations and if used elsewhere will always evaluate to "undefined". Consider renaming this property.`,
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api
                get key() {};
            }`,
            errors: [
                {
                    message: `"@api" decorators cannot be applied to property "key". The "key" is reserved for iterations and if used elsewhere will always evaluate to "undefined". Consider renaming this property.`,
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api
                set key(value) {};
                get key() {};
            }`,
            errors: [
                {
                    message: `"@api" decorators cannot be applied to property "key". The "key" is reserved for iterations and if used elsewhere will always evaluate to "undefined". Consider renaming this property.`,
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api
                key = 1;
            }`,
            errors: [
                {
                    message: `"@api" decorators cannot be applied to property "key". The "key" is reserved for iterations and if used elsewhere will always evaluate to "undefined". Consider renaming this property.`,
                },
            ],
        },
    ],
});
