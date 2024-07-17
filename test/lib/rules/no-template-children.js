/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

function makeCode(property, style) {
    switch (style) {
        case 'direct':
            return `const foo = this.template.${property};`;
        case 'destructuring':
            return `const { ${property} } = this.template;`;
        case 'destructuring-rename':
            return `const { ${property}: foo } = this.template;`;
        case 'destructuring-on-this':
            return `const { template: { ${property} } } = this;`;
        case 'destructuring-on-this-rename':
            return `const { template: { ${property}: foo } } = this;`;
    }
}

function buildCases({ properties, styles }) {
    const cases = [];
    for (const property of properties) {
        for (const style of styles) {
            cases.push({
                code: makeCode(property, style),
                errors: [
                    {
                        message: new RegExp(`Accessing ${property} on this\\.template is unsafe`),
                    },
                ],
            });
        }
    }

    return cases;
}

const styles = [
    'direct',
    'destructuring',
    'destructuring-rename',
    'destructuring-on-this',
    'destructuring-on-this-rename',
];

const invalidCases = buildCases({
    properties: [
        'children',
        'childNodes',
        'firstChild',
        'firstElementChild',
        'lastChild',
        'lastElementChild',
    ],
    styles,
});

const validCases = [
    // `this[template]` is valid, `this.template` is not
    {
        code: `const { firstChild } = this[template];`,
    },
    {
        code: `const firstChild = this[template].firstChild;`,
    },
    // check we don't get an undefined/null error for checking the node parent/grandparent
    {
        code: 'this',
    },
    ...buildCases({
        properties: [
            'getElementById',
            'getElementsByClassName',
            'querySelector',
            'querySelectorAll',
        ],
        styles,
    }).map(({ code }) => ({ code })),
];

testRule('no-template-children', {
    valid: validCases,
    invalid: invalidCases,
});
