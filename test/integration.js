/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const assert = require('assert');
const path = require('path');
const eslint = require('eslint');

const local = require('../lib/index');

function ssrLinter() {
    return new eslint.ESLint({
        overrideConfigFile: true,
        overrideConfig: {
            languageOptions: { sourceType: 'module', ecmaVersion: 2022 },
            plugins: { '@lwc/lwc': local },
            rules: {
                '@lwc/lwc/ssr-no-form-factor': 'error',
            },
        },
    });
}

const SSR_IMPORT = `import { formFactor } from '@salesforce/client/formFactor';`;

it('should resolve plugin rules', async () => {
    const cli = new eslint.ESLint({
        overrideConfigFile: true,
        overrideConfig: {
            plugins: { '@lwc/lwc': local },
            rules: {
                '@lwc/lwc/no-document-query': 'error',
                '@lwc/lwc/no-inner-html': 'warn',
            },
        },
    });

    const results = await cli.lintText(`
        document.querySelectorAll("a").innerHTML = 'Hello'
    `);

    const { messages } = results[0];

    assert.equal(messages.length, 2);
    assert.equal(messages[0].ruleId, '@lwc/lwc/no-document-query');
    assert.equal(messages[0].severity, 2);
    assert.equal(messages[1].ruleId, '@lwc/lwc/no-inner-html');
    assert.equal(messages[1].severity, 1);
});

it('should run ssr rules for a server-renderable component', async () => {
    const results = await ssrLinter().lintText(SSR_IMPORT, {
        filePath: path.resolve(__dirname, 'fixtures/ssr-enabled/component.js'),
    });

    const { messages } = results[0];
    assert.equal(messages.length, 1);
    assert.equal(messages[0].ruleId, '@lwc/lwc/ssr-no-form-factor');
});

it('should skip ssr rules for a component without an SSR capability', async () => {
    const results = await ssrLinter().lintText(SSR_IMPORT, {
        filePath: path.resolve(__dirname, 'fixtures/ssr-disabled/component.js'),
    });

    assert.equal(results[0].messages.length, 0);
});
