/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/valid-api');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('valid-api', rule, {
    valid: [
        {
            code: 'api();',
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo = null;
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo = 'bar';
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
            _foo;

            get foo() { return this._foo; }
            @api
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
                @api({ param: true })
                foo;
            }`,
            errors: [{ message: `"@api" decorators don't support argument.` }],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api static foo;
            }`,
            errors: [
                { message: '"@api" decorators can only be applied to class fields and methods.' },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api static foo() {};
            }`,
            errors: [
                { message: '"@api" decorators can only be applied to class fields and methods.' },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api foo = true;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property initialization for "foo". Boolean public properties should not be initialized to "true", consider initializing the property to "false".',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api data;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property "data". Properties starting with "data" are reserved properties.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api dataFooBar;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property "dataFooBar". Properties starting with "data" are reserved properties.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api tabindex;
            }`,
            errors: [
                {
                    message: `Ambiguous public property "tabindex". Consider renaming the property to it's camelCased version "tabIndex".`,
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api maxlength;
            }`,
            errors: [
                {
                    message: `Ambiguous public property "maxlength". Consider renaming the property to it's camelCased version "maxLength".`,
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api slot;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property "slot". This property name is a reserved property.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api part;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property "part". This property name is a reserved property.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api foo = 1;
                @api foo = 2;
            }`,
            errors: [{ message: '"foo" has already been declared as a public property.' }],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                _foo;

                @api foo = 1;

                @api
                get foo() { return this._foo; }
                set foo(value) { this._foo = value; }
            }`,
            errors: [{ message: '"foo" has already been declared as a public property.' }],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api foo = 1;
                @api foo() {}
            }`,
            errors: [{ message: '"foo" has already been declared as a public property.' }],
        },
    ],
});
