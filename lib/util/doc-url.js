/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { version, repository } = require('../../package.json');

function docUrl(ruleName) {
    // strip ".git" from end of URL
    const base = repository.url.slice(0, -4);
    return `${base}/blob/v${version}/docs/rules/${ruleName}.md`;
}

module.exports = {
    docUrl,
};
