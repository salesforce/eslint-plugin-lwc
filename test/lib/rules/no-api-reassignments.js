/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-api-reassignments', {
    valid: [
        {
            code: `this.foo = 1;`,
        },
        {
            code: `class Test {
                @api foo;
            }`,
        },
        {
            code: `class Test {
                @api foo = 1;
            }`,
        },
        {
            code: `class Test {
                @api foo;

                method(obj) {
                    obj.foo = 1;
                }
            }`,
        },
        {
            code: `class Test {
                @api foo;

                method() {
                    function test() {
                        this.foo = 1;
                    }
                }
            }`,
        },
        {
            code: `class Test {
                @api foo;

                method() {
                    const test = function() {
                        this.foo = 1;
                    }
                }
            }`,
        },
        {
            code: `class Test {
                @api foo;

                method() {
                    const obj = {
                        inner() {
                            this.foo = 1;
                        }
                    }
                }
            }`,
        },
        {
            code: `class Test {
                @api 
                foo() {
                    this.foo = 1;
                }
            }`,
        },
    ],
    invalid: [
        {
            code: `class Test {
                @api foo;

                method() {
                    this.foo = 1;
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api 
                set foo(v) {}

                method() {
                    this.foo = 1;
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api 
                get foo() {}

                method() {
                    this.foo = 1;
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api foo;

                method() {
                    const obj = {
                        inner: () => {
                            this.foo = 1;
                        }
                    }
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api foo;

                method() {
                    {
                        this.foo = 1;
                    }
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api foo;

                method() {
                    const test = () => {
                        this.foo = 1;
                    }
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api foo;

                method = () => {
                    this.foo = 1;
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
    ],
});

testTypeScript('no-api-reassignments', {
    valid: [
        {
            code: `this.foo = 1;`,
        },
        {
            code: `class Test {
                @api foo: string;
            }`,
        },
        {
            code: `class Test {
                @api foo: number = 1;
            }`,
        },
        {
            code: `class Test {
                @api foo: number;

                method(obj: any) {
                    obj.foo = 1;
                }
            }`,
        },
        {
            code: `class Test {
                @api foo: number;

                method() {
                    function test() {
                        this.foo = 1;
                    }
                }
            }`,
        },
        {
            code: `class Test {
                @api public foo: number;

                method() {
                    const test = function() {
                        this.foo = 1;
                    }
                }
            }`,
        },
        {
            code: `class Test {
                @api public foo: number;

                method() {
                    const obj = {
                        inner() {
                            this.foo = 1;
                        }
                    }
                }
            }`,
        },
        {
            code: `class Test {
                @api 
                public foo(): void {
                    this.foo = 1;
                }
            }`,
        },
    ],
    invalid: [
        {
            code: `class Test {
                @api foo: number;

                method() {
                    this.foo = 1;
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api 
                set foo(v: number) {}

                method() {
                    this.foo = 1;
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api 
                get foo(): number {}

                method() {
                    this.foo = 1;
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api public foo: number;

                method() {
                    const obj = {
                        inner: () => {
                            this.foo = 1;
                        }
                    }
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api foo: number;

                method() {
                    {
                        this.foo = 1;
                    }
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api foo: number;

                method() {
                    const test = () => {
                        this.foo = 1;
                    }
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
        {
            code: `class Test {
                @api foo: number;

                method = () => {
                    this.foo = 1;
                }
            }`,
            errors: [
                {
                    message: 'Invalid reassignment of public property "foo"',
                },
            ],
        },
    ],
});
