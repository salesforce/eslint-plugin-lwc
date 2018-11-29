'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-inner-html');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-inner-html', rule, {
    valid: ['var innerHTML = 1'],
    invalid: [
        {
            code: "element.innerHTML = '...'",
            errors: [
                {
                    message: "Using 'innerHTML/outputHTML/insertAdjacentHTML' is not allowed",
                    type: 'Identifier',
                    line: 1,
                    column: 9,
                },
            ],
        },
        {
            code: "element.outerHTML = '...'",
            errors: [
                {
                    message: "Using 'innerHTML/outputHTML/insertAdjacentHTML' is not allowed",
                    type: 'Identifier',
                    line: 1,
                    column: 9,
                },
            ],
        },
        {
            code: "element.insertAdjacentHTML = '...'",
            errors: [
                {
                    message: "Using 'innerHTML/outputHTML/insertAdjacentHTML' is not allowed",
                    type: 'Identifier',
                    line: 1,
                    column: 9,
                },
            ],
        },
        {
            code: "document.getElementById('demo').innerHTML = '...'",
            errors: [
                {
                    message: "Using 'innerHTML/outputHTML/insertAdjacentHTML' is not allowed",
                    type: 'Identifier',
                    line: 1,
                    column: 33,
                },
            ],
        },
        {
            code: "element['innerHTML'] = '...'",
            errors: [
                {
                    message: "Using 'innerHTML/outputHTML/insertAdjacentHTML' is not allowed",
                    type: 'Literal',
                    line: 1,
                    column: 9,
                },
            ],
        },
    ],
});
