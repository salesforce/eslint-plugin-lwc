/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const jsTester = new RuleTester({
    parser: require.resolve('@babel/eslint-parser'),
    parserOptions: {
        requireConfigFile: false,
        babelOptions: {
            parserOpts: {
                plugins: ['classProperties', ['decorators', { decoratorsBeforeExport: false }]],
            },
        },
    },
});

const tsTester = new RuleTester({
    parser: require.resolve('@babel/eslint-parser'),
    parserOptions: {
        requireConfigFile: false,
        babelOptions: {
            parserOpts: {
                plugins: [
                    'classProperties',
                    ['decorators', { decoratorsBeforeExport: false }],
                    'typescript',
                ],
            },
        },
    },
});

const testRule = (name, tests) => {
    const rule = require(`../../lib/rules/${name}`);
    jsTester.run(`[JS] ${name}`, rule, tests);
    tsTester.run(`[TS] ${name}`, rule, tests);
};

const testTypeScript = (name, tests) => {
    const rule = require(`../../lib/rules/${name}`);
    tsTester.run(`[TS] ${name}`, rule, tests);
};

module.exports = {
    testRule,
    testTypeScript,
};
