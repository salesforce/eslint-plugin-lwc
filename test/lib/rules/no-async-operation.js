/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-async-operation');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-async-operations', rule, {
    valid: [
        {
            code: 'obj.setTimeout();',
        },
        {
            code: `
                const obj = {}; 
                obj.setTimeout();
            `,
        },
        {
            code: `
                const setTimeout = () => {}; 
                setTimeout();
            `,
        },
        {
            code: `
                const setTimeout = () => {}; 

                function foo() {
                    setTimeout();
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                setTimeout();
                setInterval();
                requestAnimationFrame();
            `,
            errors: [
                { message: 'Restricted async operation "setTimeout"' },
                { message: 'Restricted async operation "setInterval"' },
                { message: 'Restricted async operation "requestAnimationFrame"' },
            ],
        },
        {
            code: `
                window.setTimeout();
                window.setInterval();
                window.requestAnimationFrame();
            `,
            errors: [
                { message: 'Restricted async operation "setTimeout"' },
                { message: 'Restricted async operation "setInterval"' },
                { message: 'Restricted async operation "requestAnimationFrame"' },
            ],
        },
        {
            code: `
                window["setTimeout"]();
                window["setInterval"]();
                window["requestAnimationFrame"]();
            `,
            errors: [
                { message: 'Restricted async operation "setTimeout"' },
                { message: 'Restricted async operation "setInterval"' },
                { message: 'Restricted async operation "requestAnimationFrame"' },
            ],
        },
        {
            code: `
                function foo() {
                    setTimeout();
                }
            `,
            errors: [{ message: 'Restricted async operation "setTimeout"' }],
        },
    ],
});
