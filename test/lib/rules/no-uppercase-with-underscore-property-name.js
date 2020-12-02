/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-uppercase-with-underscore-property-name');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-uppercase-with-underscore-property-name', rule, {
    valid: [
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api bar_foo() {}
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api barFoo() {}
        }`,
        },
    ],
    invalid: [
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api bar_Foo() {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "bar_F"',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api _barFoo() {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "_barF"',
                },
            ],
        },
    ],
});
