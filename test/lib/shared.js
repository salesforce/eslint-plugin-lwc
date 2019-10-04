/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const ESLINT_TEST_CONFIG = {
    parser: require.resolve('babel-eslint'),
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module',
    },
};

module.exports = {
    ESLINT_TEST_CONFIG,
};
