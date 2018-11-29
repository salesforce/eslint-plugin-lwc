'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const eslint = require('eslint');

const SCOPE_DIRECTORY = path.resolve(__dirname, '../node_modules/@lwc');
const PACKAGE_DIRECTORY = path.resolve(SCOPE_DIRECTORY, 'eslint-plugin-lwc');

before(() => {
    if (!fs.existsSync(SCOPE_DIRECTORY)) {
        fs.mkdirSync(SCOPE_DIRECTORY);
    }

    if (!fs.existsSync(PACKAGE_DIRECTORY)) {
        fs.symlinkSync(path.resolve(__dirname, '..'), PACKAGE_DIRECTORY, 'dir');
    }
});

after(() => {
    if (fs.existsSync(PACKAGE_DIRECTORY)) {
        fs.unlinkSync(PACKAGE_DIRECTORY);
    }

    if (fs.existsSync(SCOPE_DIRECTORY)) {
        fs.rmdirSync(SCOPE_DIRECTORY);
    }
});

it('should resolve plugin rules', () => {
    const cli = new eslint.CLIEngine({
        useEslintrc: false,
        plugins: ['@lwc/eslint-plugin-lwc'],
        rules: {
            '@lwc/lwc/no-document-query': 'error',
            '@lwc/lwc/no-inner-html': 'warn',
        },
    });

    const report = cli.executeOnText(`
        document.querySelectorAll("a").innerHTML = 'Hello'
    `);

    const { messages } = report.results[0];

    assert.equal(messages.length, 2);
    assert.equal(messages[0].ruleId, '@lwc/lwc/no-document-query');
    assert.equal(messages[0].severity, 2);
    assert.equal(messages[1].ruleId, '@lwc/lwc/no-inner-html');
    assert.equal(messages[1].severity, 1);
});
