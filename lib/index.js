/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const rules = {
    'consistent-component-name': require('./rules/consistent-component-name'),
    'no-async-await': require('./rules/no-async-await'),
    'no-async-operation': require('./rules/no-async-operation'),
    'no-deprecated': require('./rules/no-deprecated'),
    'no-document-query': require('./rules/no-document-query'),
    'no-dupe-class-members': require('./rules/no-dupe-class-members'),
    'no-for-of': require('./rules/no-for-of'),
    'no-inner-html': require('./rules/no-inner-html'),
    'no-leading-uppercase-api-name': require('./rules/no-leading-uppercase-api-name'),
    'no-rest-parameter': require('./rules/no-rest-parameter'),
    'valid-api': require('./rules/valid-api'),
    'valid-track': require('./rules/valid-track'),
    'valid-wire': require('./rules/valid-wire'),
};

module.exports = {
    rules,
};
