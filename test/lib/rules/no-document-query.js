/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

testRule('no-document-query', {
    valid: [
        {
            code: `
                this.querySelector('td');
                this.querySelectorAll('td');
                this.getElementsByTagName('td');
                this.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'td');
                this.getElementsByClassName('foo');
                this.getElementById('foo');
            `,
        },
        {
            code: `
                elm.querySelector('td');
                elm.querySelectorAll('td');
                elm.getElementsByTagName('td');
                elm.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'td');
                elm.getElementsByClassName('foo');
                elm.getElementById('foo');
            `,
        },
    ],
    invalid: [
        {
            code: `
                document.querySelector('td');
                document.querySelectorAll('td');
                document.getElementsByTagName('td');
                document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'td');
                document.getElementsByClassName('foo');
                document.getElementById('foo');
            `,
            errors: [
                {
                    message:
                        'Invalid usage of "querySelector". DOM query at the document level is forbidden.',
                },
                {
                    message:
                        'Invalid usage of "querySelectorAll". DOM query at the document level is forbidden.',
                },
                {
                    message:
                        'Invalid usage of "getElementsByTagName". DOM query at the document level is forbidden.',
                },
                {
                    message:
                        'Invalid usage of "getElementsByTagNameNS". DOM query at the document level is forbidden.',
                },
                {
                    message:
                        'Invalid usage of "getElementsByClassName". DOM query at the document level is forbidden.',
                },
                {
                    message:
                        'Invalid usage of "getElementById". DOM query at the document level is forbidden.',
                },
            ],
        },
    ],
});
