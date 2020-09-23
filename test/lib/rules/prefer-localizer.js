/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/prefer-localizer');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('prefer-localizer', rule, {
    valid: [
        {
            code: `getNumberFormat('de-DE', { style: 'currency', currency: 'EUR' });`,
        },
        {
            code: `getDateTimeFormat('fi', {year: 'numeric', month: 'long', day: 'numeric'});`,
        },
        {
            code: `getIntlOptionsFromCLDR("en-US", "shortDateFormat");`,
        },
        {
            code: `const dateFormatter = getDateTimeFormat("en-US", intlOptions);`,
        },
        {
            code: `numberFormatInstance = new LocalizerImpl.NumberFormat(locale, options);`,
        },
        {
            code: `new Intl.Collator();`,
        },
        {
            code: `new Intl.DisplayNames();`,
        },
        {
            code: `new Intl.ListFormat();`,
        },
        {
            code: `new Intl.Locale();`,
        },
        {
            code: `Intl.PluralRules();`,
        },
    ],
    invalid: [
        {
            code: `const fullNameFormatter = new Intl.DateTimeFormat(intlLocales, {
                    weekday: 'long',
                    timeZone: 'UTC',
                  });`,
            errors: [
                {
                    message: 'Prefer using "@salesforce/localizerjs" over directly calling "Intl".',
                },
            ],
        },
        {
            code: `numberFormatInstance = new Intl.NumberFormat(locale, options);`,
            env: {
                browser: true,
            },
            errors: [
                {
                    message: 'Prefer using "@salesforce/localizerjs" over directly calling "Intl".',
                },
            ],
        },
        {
            code: `new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });`,
            env: {
                browser: true,
            },
            errors: [
                {
                    message: 'Prefer using "@salesforce/localizerjs" over directly calling "Intl".',
                },
            ],
        },
        {
            code: `const rtf = new Intl.RelativeTimeFormat("en", {
                    localeMatcher: "best fit", // other values: "lookup"
                    numeric: "always", // other values: "auto"
                    style: "long", // other values: "short" or "narrow"
                });`,
            errors: [
                {
                    message: 'Prefer using "@salesforce/localizerjs" over directly calling "Intl".',
                },
            ],
        },
    ],
});
