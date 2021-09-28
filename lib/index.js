/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const rules = {
    'consistent-component-name': require('./rules/consistent-component-name'),
    'no-api-reassignments': require('./rules/no-api-reassignments'),
    'no-async-await': require('./rules/no-async-await'),
    'no-async-operation': require('./rules/no-async-operation'),
    'no-attributes-during-construction': require('./rules/no-attributes-during-construction'),
    'no-deprecated': require('./rules/no-deprecated'),
    'no-document-query': require('./rules/no-document-query'),
    'no-dupe-class-members': require('./rules/no-dupe-class-members'),
    'no-for-of': require('./rules/no-for-of'),
    'no-inner-html': require('./rules/no-inner-html'),
    'no-leading-uppercase-api-name': require('./rules/no-leading-uppercase-api-name'),
    'no-leaky-event-listeners': require('./rules/no-leaky-event-listeners'),
    'no-template-children': require('./rules/no-template-children'),
    'no-unexpected-wire-adapter-usages': require('./rules/no-unexpected-wire-adapter-usages'),
    'no-rest-parameter': require('./rules/no-rest-parameter'),
    'no-unknown-wire-adapters': require('./rules/no-unknown-wire-adapters'),
    'prefer-custom-event': require('./rules/prefer-custom-event'),
    'valid-api': require('./rules/valid-api'),
    'valid-track': require('./rules/valid-track'),
    'valid-wire': require('./rules/valid-wire'),
};

module.exports = {
    rules,
};
