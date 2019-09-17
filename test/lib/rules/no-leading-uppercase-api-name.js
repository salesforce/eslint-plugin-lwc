/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-leading-uppercase-api-name');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-leading-uppercase-api-name', rule, {
    valid: [
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo;
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            _foo;
            @api
            get foo() { return this._foo; }
            set foo(value) { this._foo = value; }
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo() {}
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api onChange() {}
        }`,
        },
    ],
    invalid: [
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api Foo;
        }`,
            errors: [
                {
                    message:
                        'Invalid property name syntax in "Foo". Property name must start with a lowercase character.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            _foo;
            @api
            get Foo() { return this._foo; }
            set Foo(value) { this._foo = value; }
        }`,
            errors: [
                {
                    message:
                        'Invalid property name syntax in "Foo". Property name must start with a lowercase character.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api Foo() {}
        }`,
            errors: [
                {
                    message:
                        'Invalid property name syntax in "Foo". Property name must start with a lowercase character.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api OnChange() {}
        }`,
            errors: [
                {
                    message:
                        'Invalid property name syntax in "OnChange". Property name must start with a lowercase character.',
                },
            ],
        },
    ],
});
