'use strict';

const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.mocha,
                ...globals.node,
            },

            ecmaVersion: 9,
            sourceType: 'commonjs',
        },

        rules: {
            strict: ['error', 'global'],
        },
    },
];
