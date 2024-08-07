/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('valid-api', {
    valid: [
        {
            code: 'api();',
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api data
        }`,
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
        /* no mix of uppercase and underscore characters */
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api bar_foo() {}
        }`,
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api barFoo() {}
        }`,
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foobar() {}
        }`,
            options: [{ disallowUnderscoreUppercaseMix: true }],
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
                @api dataFooBar;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property name "dataFooBar". Properties starting with "data" correspond to data-* HTML attributes, which are not allowed.',
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
                @api dataset;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property "dataset". This property name is a reserved property.',
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
        /* no mix of uppercase and underscore characters */
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api bar_Foo() {};
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "bar_Foo"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api _barFoo() {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "_barFoo"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api _barfoO() {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "_barfoO"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api Foo_bar() {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "Foo_bar"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api Foobar_() {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "Foobar_"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
    ],
});

testTypeScript('valid-api', {
    valid: [
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api data: string
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo: string
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo: string | null = null;
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foo: string = 'bar';
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            _foo: string;

            @api
            get foo(): string { return this._foo; }
            set foo(value: string) { this._foo = value; }
        }`,
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            _foo: string;

            get foo(): string { return this._foo; }
            @api
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
        /* no mix of uppercase and underscore characters */
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api bar_foo(): string {}
        }`,
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api barFoo(): string {}
        }`,
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api foobar(): string {}
        }`,
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
    ],
    invalid: [
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api({ param: true })
                foo: string;
            }`,
            errors: [{ message: `"@api" decorators don't support argument.` }],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api static foo: string;
            }`,
            errors: [
                { message: '"@api" decorators can only be applied to class fields and methods.' },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api static foo(): string {};
            }`,
            errors: [
                { message: '"@api" decorators can only be applied to class fields and methods.' },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api foo: boolean = true;
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
                @api dataset: string;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property "dataset". This property name is a reserved property.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api dataFooBar: string;
            }`,
            errors: [
                {
                    message:
                        'Invalid public property name "dataFooBar". Properties starting with "data" correspond to data-* HTML attributes, which are not allowed.',
                },
            ],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api tabindex: string;
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
                @api maxlength: string;
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
                @api slot: string;
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
                @api part: string;
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
                @api foo: number = 1;
                @api foo: number = 2;
            }`,
            errors: [{ message: '"foo" has already been declared as a public property.' }],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                _foo: number;

                @api foo: number = 1;

                @api
                get foo(): number { return this._foo; }
                set foo(value: number) { this._foo = value; }
            }`,
            errors: [{ message: '"foo" has already been declared as a public property.' }],
        },
        {
            code: `import { api } from 'lwc';
            class Foo {
                @api foo: number = 1;
                @api foo(): number {}
            }`,
            errors: [{ message: '"foo" has already been declared as a public property.' }],
        },
        /* no mix of uppercase and underscore characters */
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api bar_Foo(): number {};
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "bar_Foo"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api _barFoo(): number {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "_barFoo"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api _barfoO(): number {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "_barfoO"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api Foo_bar(): number {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "Foo_bar"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
        {
            code: `import { api } from 'lwc';
        class Foo {
            @api Foobar_(): number {}
        }`,
            errors: [
                {
                    message:
                        'Avoid using both uppercase and underscores in property names: "Foobar_"',
                },
            ],
            options: [{ disallowUnderscoreUppercaseMix: true }],
        },
    ],
});
