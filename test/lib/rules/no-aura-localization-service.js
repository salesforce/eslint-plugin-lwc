/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-aura-localization-service');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-aura-localization-service', rule, {
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
    ],
    invalid: [
        {
            code: `$A.localizationService.formatDateTimeUTC()`,
            errors: [
                {
                    message: 'Disallow usage of "$A.localizationService".',
                },
            ],
        },
        {
            code: `$A.localizationService.parseDateTime()`,
            errors: [
                {
                    message: 'Disallow usage of "$A.localizationService".',
                },
            ],
        },
        {
            code: `$A.localizationService.parseBigDecimal()`,
            errors: [
                {
                    message: 'Disallow usage of "$A.localizationService".',
                },
            ],
        },
    ],
});
