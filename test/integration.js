/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const assert = require('assert');
const eslint = require('eslint');

const local = require('../lib/index');

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
