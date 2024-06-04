/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('valid-track', {
    valid: [
        {
            code: 'track();',
        },
        {
            code: `import { track } from 'lwc';
        class Foo {
            @track state
        }`,
        },
    ],
    invalid: [
        {
            code: `import { track } from 'lwc';
            @track
            class Foo {
            }`,
            errors: [{ message: '"@track" decorators can only be applied to class fields' }],
        },
        {
            code: `import { track } from 'lwc';
            class Foo {
                @track
                handleClick() {}
            }`,
            errors: [{ message: '"@track" decorators can only be applied to class fields' }],
        },
        {
            code: `import { track } from 'lwc';
            class Foo {
                @track
                get state() {}
            }`,
            errors: [{ message: '"@track" decorators can only be applied to class fields' }],
        },
        {
            code: `import { track } from 'lwc';
            class Foo {
                @track
                static state;
            }`,
            errors: [{ message: '"@track" decorators can only be applied to class fields' }],
        },
        {
            code: `import { track } from 'lwc';
            class Foo {
                @track({ param: true })
                state
            }`,
            errors: [{ message: `"@track" decorators don't support argument` }],
        },
    ],
});

testTypeScript('valid-track', {
    valid: [
        {
            code: 'track() satisfies any;',
        },
        {
            code: `import { track } from 'lwc';
        class Foo {
            @track state: object
        }`,
        },
    ],
    invalid: [
        {
            code: `import { track } from 'lwc';
            class Foo {
                @track
                handleClick(): void {}
            }`,
            errors: [{ message: '"@track" decorators can only be applied to class fields' }],
        },
        {
            code: `import { track } from 'lwc';
            class Foo {
                @track
                get state(): object {}
            }`,
            errors: [{ message: '"@track" decorators can only be applied to class fields' }],
        },
        {
            code: `import { track } from 'lwc';
            class Foo {
                @track
                static state: object;
            }`,
            errors: [{ message: '"@track" decorators can only be applied to class fields' }],
        },
        {
            code: `import { track } from 'lwc';
            class Foo {
                @track({ param: true })
                state: object
            }`,
            errors: [{ message: `"@track" decorators don't support argument` }],
        },
    ],
});
