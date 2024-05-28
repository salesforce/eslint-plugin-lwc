/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

testRule('no-inner-html', {
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
