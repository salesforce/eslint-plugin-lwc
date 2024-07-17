/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

// TODO: Type assertions break this rule

testRule('no-async-operation', {
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

testTypeScript('no-async-operation', {
    valid: [
        {
            code: 'obj.setTimeout();',
        },
        {
            code: `
                const obj: object = {}; 
                obj.setTimeout();
            `,
        },
        {
            code: `
                const setTimeout: Function = () => {}; 
                setTimeout();
            `,
        },
        {
            code: `
                const setTimeout: Function = () => {}; 

                function foo() {
                    setTimeout();
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                setTimeout() satisfies number;
                setInterval() satisfies number;
                requestAnimationFrame() satisfies number;
            `,
            errors: [
                { message: 'Restricted async operation "setTimeout"' },
                { message: 'Restricted async operation "setInterval"' },
                { message: 'Restricted async operation "requestAnimationFrame"' },
            ],
        },
        // {
        //     code: `
        //         (window as any).setTimeout();
        //         (window as any).setInterval();
        //         (window as any).requestAnimationFrame();
        //     `,
        //     errors: [
        //         { message: 'Restricted async operation "setTimeout"' },
        //         { message: 'Restricted async operation "setInterval"' },
        //         { message: 'Restricted async operation "requestAnimationFrame"' },
        //     ],
        // },
        // {
        //     code: `
        //         (window as any)["setTimeout"]();
        //         (window as any)["setInterval"]();
        //         (window as any)["requestAnimationFrame"]();
        //     `,
        //     errors: [
        //         { message: 'Restricted async operation "setTimeout"' },
        //         { message: 'Restricted async operation "setInterval"' },
        //         { message: 'Restricted async operation "requestAnimationFrame"' },
        //     ],
        // },
        {
            code: `
                function foo(): void {
                    setTimeout();
                }
            `,
            errors: [{ message: 'Restricted async operation "setTimeout"' }],
        },
    ],
});
