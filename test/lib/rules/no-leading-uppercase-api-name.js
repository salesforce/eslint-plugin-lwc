/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-leading-uppercase-api-name', {
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

testTypeScript('no-leading-uppercase-api-name', {
    valid: [
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo: string;
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            _foo;
            @api
            get foo(): string { return this._foo; }
            set foo(value: string) { this._foo = value; }
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo(): string {}
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api onChange(): string {}
        }`,
        },
    ],
    invalid: [
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api Foo: string;
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
            _foo: string;
            @api
            get Foo(): string { return this._foo; }
            set Foo(value: string) { this._foo = value; }
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
            @api Foo(): string {}
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
            @api OnChange(): string {}
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
