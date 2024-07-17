/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('valid-wire', {
    valid: [
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo)
                wiredProp;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo, {})
                wiredProp;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo, {
                    key1: "$propA",
                    key2: "$propB",
                    key3: "fixed",
                    key4: ["fixed"]
                })
                wiredProp;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @wire(getFoo)
                wiredProp;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @wire(getFoo)
                wiredA;
                @wire(getFoo)
                wiredB;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @wire(getFoo)
                wiredA;
                @wire(getFoo)
                wiredB;
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
            import getFoo from 'adapter';

            decorate(class Test {
                wiredMethod() {}
            }, {
                wiredMethod: wire(getFoo)
            })`,
        },
        {
            code: `import { api, wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @api foo;

                @wire(getFoo)
                wiredMethod() {}
            }`,
        },
        {
            code: `import { api, wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @api
                get foo() {};
                set foo(value) {};

                @wire(getFoo)
                wiredMethod() {}
            }`,
        },
    ],
    invalid: [
        {
            code: `import { wire } from 'lwc';
            class Test {
                @wire wiredProp;
            }`,
            errors: [
                {
                    message:
                        '"@wire" decorators need to be invoked with a wire adapter as first argument.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            class Test {
                @wire()
                wiredProp;
            }`,
            errors: [
                {
                    message:
                        '"@wire" decorators expect the identifier of an adapter to be passed as first argument.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';

            class Test {
                @wire('get-foo-adapter')
                wiredProp;
            }`,
            errors: [
                {
                    message:
                        '"@wire" decorators expect the identifier of an adapter to be passed as first argument.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';

            @wire(getFoo)
            class Test {}`,
            errors: [
                { message: '"@wire" decorators can only be applied to class field and methods.' },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';

            const config = {};
            class Test {
                @wire(getFoo, config)
                wiredProp;
            }`,
            errors: [
                {
                    message:
                        '"@wire" decorators expect a configuration as an object expression as second argument.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';

            class Test {
                @wire(getFoo)
                static wiredProp;
            }`,
            errors: [{ message: `"@wire" decorators can't be applied to static properties.` }],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';

            class Test {
                @wire(getFoo)
                static wiredProp() {};
            }`,
            errors: [{ message: `"@wire" decorators can't be applied to static properties.` }],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';

            class Test {
                @wire(getFoo)
                get wiredProp() {};
            }`,
            errors: [
                { message: `"@wire" decorators can only be applied to class field and methods.` },
            ],
        },
    ],
});

testTypeScript('valid-wire', {
    valid: [
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo)
                wiredProp: string;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo, {})
                wiredProp: string;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import { getFoo } from 'adapter';

            class Test {
                @wire(getFoo, { 
                    key1: "$propA", 
                    key2: "$propB", 
                    key3: "fixed", 
                    key4: ["fixed"] 
                })
                wiredProp: string;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @wire(getFoo)
                wiredProp: string;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @wire(getFoo)
                wiredA: string;
                @wire(getFoo)
                wiredB: number;
            }`,
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter';

            class Test {
                @wire(getFoo)
                wiredA: string;
                @wire(getFoo)
                wiredB: number;
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
            import getFoo from 'adapter';
            
            decorate(class Test {
                wiredMethod(): void {}
            }, {
                wiredMethod: wire(getFoo)
            })`,
        },
        {
            code: `import { api, wire } from 'lwc';
            import getFoo from 'adapter';
            
            class Test {
                @api foo: string;

                @wire(getFoo)
                wiredMethod(): void {}
            }`,
        },
        {
            code: `import { api, wire } from 'lwc';
            import getFoo from 'adapter';
            
            class Test {
                @api 
                get foo(): string {};
                set foo(value: string): void {};
                
                @wire(getFoo)
                wiredMethod(): void {}
            }`,
        },
    ],
    invalid: [
        {
            code: `import { wire } from 'lwc';
            class Test {
                @wire wiredProp: string;
            }`,
            errors: [
                {
                    message:
                        '"@wire" decorators need to be invoked with a wire adapter as first argument.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            class Test {
                @wire() 
                wiredProp: string;
            }`,
            errors: [
                {
                    message:
                        '"@wire" decorators expect the identifier of an adapter to be passed as first argument.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';

            class Test {
                @wire('get-foo-adapter') 
                wiredProp: string;
            }`,
            errors: [
                {
                    message:
                        '"@wire" decorators expect the identifier of an adapter to be passed as first argument.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';

            const config: Record<string, unknown> = {};
            class Test {
                @wire(getFoo, config) 
                wiredProp: string;
            }`,
            errors: [
                {
                    message:
                        '"@wire" decorators expect a configuration as an object expression as second argument.',
                },
            ],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';
            
            class Test {
                @wire(getFoo) 
                static wiredProp: string;
            }`,
            errors: [{ message: `"@wire" decorators can't be applied to static properties.` }],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';
            
            class Test {
                @wire(getFoo) 
                static wiredProp(): void {};
            }`,
            errors: [{ message: `"@wire" decorators can't be applied to static properties.` }],
        },
        {
            code: `import { wire } from 'lwc';
            import getFoo from 'adapter-foo';
            
            class Test {
                @wire(getFoo) 
                get wiredProp(): number {};
            }`,
            errors: [
                { message: `"@wire" decorators can only be applied to class field and methods.` },
            ],
        },
    ],
});
