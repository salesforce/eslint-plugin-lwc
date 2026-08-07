/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const path = require('path');
const { RuleTester } = require('eslint');
const babelParser = require('@babel/eslint-parser');

// SSR rules gate on the component's *.js-meta.xml. These fixtures let RuleTester cases
// (which never touch disk for `code`) resolve to a real bundle directory: one that
// declares an SSR capability and one that does not.
const SSR_ENABLED_FILE = path.resolve(__dirname, '../fixtures/ssr-enabled/component.js');
const SSR_DISABLED_FILE = path.resolve(__dirname, '../fixtures/ssr-disabled/component.js');

const jsTester = new RuleTester({
    languageOptions: {
        parser: babelParser,
        parserOptions: {
            requireConfigFile: false,
            babelOptions: {
                parserOpts: {
                    plugins: ['classProperties', ['decorators', { decoratorsBeforeExport: false }]],
                },
            },
        },
    },
});

const tsTester = new RuleTester({
    languageOptions: {
        parser: babelParser,
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

// Point each case at the SSR-capable fixture bundle so the rule's meta-xml gate opens.
// A case may still set its own `filename` (e.g. to the non-SSR fixture) to override this.
const withSsrFilename = (tests) => {
    const applyFilename = (testCase) =>
        typeof testCase === 'string'
            ? { code: testCase, filename: SSR_ENABLED_FILE }
            : { filename: SSR_ENABLED_FILE, ...testCase };
    return {
        ...tests,
        valid: (tests.valid || []).map(applyFilename),
        invalid: (tests.invalid || []).map(applyFilename),
    };
};

const testSsrRule = (name, tests) => {
    const rule = require(`../../lib/rules/${name}`);
    const ssrTests = withSsrFilename(tests);
    jsTester.run(`[JS] ${name}`, rule, ssrTests);
    tsTester.run(`[TS] ${name}`, rule, ssrTests);
};

const testSsrTypeScript = (name, tests) => {
    const rule = require(`../../lib/rules/${name}`);
    tsTester.run(`[TS] ${name}`, rule, withSsrFilename(tests));
};

module.exports = {
    testRule,
    testTypeScript,
    testSsrRule,
    testSsrTypeScript,
    SSR_ENABLED_FILE,
    SSR_DISABLED_FILE,
};
