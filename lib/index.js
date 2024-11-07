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
    'no-disallowed-lwc-imports': require('./rules/no-disallowed-lwc-imports'),
    'no-template-children': require('./rules/no-template-children'),
    'no-unexpected-wire-adapter-usages': require('./rules/no-unexpected-wire-adapter-usages'),
    'no-rest-parameter': require('./rules/no-rest-parameter'),
    'no-unknown-wire-adapters': require('./rules/no-unknown-wire-adapters'),
    'prefer-custom-event': require('./rules/prefer-custom-event'),
    'valid-api': require('./rules/valid-api'),
    'valid-graphql-wire-adapter-callback-parameters': require('./rules/valid-graphql-wire-adapter-callback-parameters'),
    'valid-track': require('./rules/valid-track'),
    'valid-wire': require('./rules/valid-wire'),
    'no-restricted-browser-globals-during-ssr': require('./rules/no-restricted-browser-globals-during-ssr'),
    'no-unsupported-ssr-properties': require('./rules/no-unsupported-ssr-properties'),
    'no-node-env-in-ssr': require('./rules/no-node-env-in-ssr'),
    // SSR rules
    'ssr/no-host-mutation-in-connected-callback': require('./rules/ssr/no-host-mutation-in-connected-callback'),
    'ssr/no-restricted-browser-globals': require('./rules/ssr/no-restricted-browser-globals'),
    'ssr/no-unsupported-properties': require('./rules/ssr/no-unsupported-properties'),
    'ssr/no-node-env': require('./rules/ssr/no-node-env'),
    'ssr/no-unsupported-node-api': require('./rules/ssr/no-unsupported-node-api'),
    'ssr/no-static-imports-of-user-specific-scoped-modules': require('./rules/ssr/no-static-imports-of-user-specific-scoped-modules'),
    'ssr/no-form-factor': require('./rules/ssr/no-form-factor'),
};

module.exports = {
    rules,
};
