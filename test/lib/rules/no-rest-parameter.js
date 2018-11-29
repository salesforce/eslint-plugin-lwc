'use strict';

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-rest-parameter');

const config = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module',
    },
};

const ruleTester = new RuleTester(config);

ruleTester.run('no-rest-parameter', rule, {
    valid: [
        {
            code: `function foo(a, b) { console.log(a, b); }`,
        },
        {
            code: `function foo() { console.log(arguments); }`,
        },
    ],
    invalid: [
        {
            code: `function foo(a, ...rest) { console.log(a, rest); }`,
            errors: [
                {
                    message: 'Invalid usage of rest parameter.',
                },
            ],
        },
    ],
});
