/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const plugin = require('../lib');

const RULES_FOLDER = path.resolve(__dirname, '../lib/rules');
const SSR_RULES_FOLDER = path.resolve(RULES_FOLDER, 'ssr');
const PROCESSORS_FOLDER = path.resolve(__dirname, '../lib/processors'); // Add processor folder path

// Utility function to get only files from a directory (excluding subdirectories)
function getRuleFiles(dir) {
    return fs.readdirSync(dir).filter((item) => {
        const fullPath = path.join(dir, item);
        return fs.lstatSync(fullPath).isFile(); // Only include files, not directories
    });
}

// Get rule files for regular rules and SSR rules
const RULE_FILES = getRuleFiles(RULES_FOLDER);
const SSR_RULE_FILES = getRuleFiles(SSR_RULES_FOLDER);
const DOC_FILES = fs.readdirSync(path.resolve(__dirname, '../docs/rules'));
const PROCESSOR_FILES = getRuleFiles(PROCESSORS_FOLDER);
const PROCESSOR_DOC_FILES = fs.readdirSync(path.resolve(__dirname, '../docs/processors'));
const SSR_DOC_FILES = fs.readdirSync(path.resolve(__dirname, '../docs/rules/ssr'));
const README_CONTENT = fs.readFileSync(path.resolve(__dirname, '../README.md'), 'utf-8');

// Tests for regular rules
describe('rules exports', () => {
    RULE_FILES.forEach((ruleFile) => {
        const ruleName = path.basename(ruleFile, '.js');

        it(`should export "${ruleFile}"`, () => {
            assert.equal(
                plugin.rules[ruleName],
                require(path.join(RULES_FOLDER, ruleFile)),
                `Rule "${ruleName}" is not exported.`,
            );
        });
    });
});

describe('rules documentation', () => {
    RULE_FILES.forEach((ruleFile) => {
        const ruleName = path.basename(ruleFile, '.js');

        it(`should have a documentation file for "${ruleName}"`, () => {
            assert(
                DOC_FILES.includes(`${ruleName}.md`),
                `No associated documentation for "${ruleName}".`,
            );
        });

        it(`should have an entry in README.md for "${ruleName}"`, () => {
            assert(
                README_CONTENT.includes(`| [lwc/${ruleName}](./docs/rules/${ruleName}.md)`),
                `Rule "${ruleName}" is not listed in the README.md.`,
            );
        });

        it(`should have a documentation url for "${ruleName}"`, () => {
            const rulePath = path.resolve(RULES_FOLDER, ruleFile);
            const ruleModule = require(rulePath);

            assert(
                typeof ruleModule.meta.docs.url === 'string',
                `Rule "${ruleName}" doesn't have a documentation url.`,
            );
        });
    });
});

// Tests for SSR rules
describe('SSR rules exports', () => {
    SSR_RULE_FILES.forEach((ruleFile) => {
        const ruleName = path.basename(ruleFile, '.js');
        const ssrRulePath = `ssr/${ruleName}`;

        it(`should export SSR rule "${ruleFile}"`, () => {
            assert.equal(
                plugin.rules[ssrRulePath],
                require(path.join(SSR_RULES_FOLDER, ruleFile)),
                `SSR Rule "${ruleName}" is not exported.`,
            );
        });
    });
});

describe('SSR rules documentation', () => {
    SSR_RULE_FILES.forEach((ruleFile) => {
        const ruleName = path.basename(ruleFile, '.js');
        const ssrRulePath = `ssr/${ruleName}`;

        it(`should have a documentation file for SSR rule "${ruleName}"`, () => {
            assert(
                SSR_DOC_FILES.includes(`${ruleName}.md`),
                `No associated documentation for SSR rule "${ruleName}".`,
            );
        });

        it(`should have an entry in README.md for SSR rule "${ruleName}"`, () => {
            assert(
                README_CONTENT.includes(`| [lwc/${ssrRulePath}](./docs/rules/${ssrRulePath}.md)`),
                `SSR Rule "${ruleName}" is not listed in the README.md.`,
            );
        });

        it(`should have a documentation url for SSR rule "${ruleName}"`, () => {
            const rulePath = path.resolve(SSR_RULES_FOLDER, ruleFile);
            const ruleModule = require(rulePath);

            assert(
                typeof ruleModule.meta.docs.url === 'string',
                `SSR Rule "${ruleName}" doesn't have a documentation url.`,
            );
        });
    });
});

describe('processor documentation', () => {
    PROCESSOR_FILES.forEach((processorFile) => {
        const processorName = path.basename(processorFile, '.js');

        it(`should have a documentation file for processor "${processorName}"`, () => {
            assert(
                PROCESSOR_DOC_FILES.includes(`${processorName}.md`),
                `No associated documentation for processor "${processorName}".`,
            );
        });

        it(`should have an entry in README.md for processor "${processorName}"`, () => {
            assert(
                README_CONTENT.includes(
                    `| [lwc/${processorName}](./docs/processors/${processorName}.md)`,
                ),
                `Processor "${processorName}" is not listed in the README.md.`,
            );
        });
    });
});
