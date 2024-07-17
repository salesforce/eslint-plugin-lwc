/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

function buildCases({ handlers }) {
    const targets = [
        null,
        'document',
        'window',
        'document.body',
        'document.querySelector("#modal")',
        'document.body.children[0]',
    ];
    const methods = ['addEventListener', 'removeEventListener'];

    const cases = [];

    for (const target of targets) {
        for (const method of methods) {
            for (const handler of handlers) {
                const code = `${method}('test', ${handler});`;
                cases.push({
                    code: target === null ? code : `${target}.${code}`,
                });
            }
        }
    }

    return cases;
}

const basicValidCases = buildCases({
    handlers: ['', 'undefined', 'null', 'handleTest', 'this.handleTest', "getListener('test')"],
});

const basicInvalidCases = buildCases({
    handlers: ['function() { return handleTest(); }', '() => handleTest', 'handleTest.bind(this)'],
}).map((entry) => {
    return {
        ...entry,
        errors: [
            {
                message: /^Event listener will leak\./,
            },
        ],
    };
});

testRule('no-leaky-event-listeners', {
    valid: [
        ...basicValidCases,

        // Global object properties shadowing.
        {
            code: `
                function addEventListener() {}
                addEventListener('test', () => handleTest());
            `,
        },
        {
            code: `
                const window = {};
                window.addEventListener('test', () => handleTest());
            `,
        },

        // Unknown root object.
        {
            code: `
                foo.addEventListener('test', () => handleTest());
            `,
        },
        {
            code: `
                this.addEventListener('test', () => handleTest());
            `,
        },
        {
            code: `
                (condition ? document : window).foo.addEventListener('test', () => handleTest());
            `,
        },
    ],
    invalid: [
        ...basicInvalidCases,

        {
            code: `
                addEventListener('test', () => handleTest());
            `,
            env: {
                browser: true,
            },
            errors: [
                {
                    message: /^Event listener will leak\./,
                },
            ],
        },
    ],
});
