/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

// TODO: Type assertions break this rule

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

// testTypeScript('no-document-query', {
//     valid: [
//         {
//             code: `
//                 (this as any).querySelector('td');
//                 (this as any).querySelectorAll('td');
//                 (this as any).getElementsByTagName('td');
//                 (this as any).getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'td');
//                 (this as any).getElementsByClassName('foo');
//                 (this as any).getElementById('foo');
//             `,
//         },
//         {
//             code: `
//                 (elm as any).querySelector('td');
//                 (elm as any).querySelectorAll('td');
//                 (elm as any).getElementsByTagName('td');
//                 (elm as any).getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'td');
//                 (elm as any).getElementsByClassName('foo');
//                 (elm as any).getElementById('foo');
//             `,
//         },
//     ],
//     invalid: [
//         {
//             code: `
//                 (document as any).querySelector('td');
//                 (document as any).querySelectorAll('td');
//                 (document as any).getElementsByTagName('td');
//                 (document as any).getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'td');
//                 (document as any).getElementsByClassName('foo');
//                 (document as any).getElementById('foo');
//             `,
//             errors: [
//                 {
//                     message:
//                         'Invalid usage of "querySelector". DOM query at the document level is forbidden.',
//                 },
//                 {
//                     message:
//                         'Invalid usage of "querySelectorAll". DOM query at the document level is forbidden.',
//                 },
//                 {
//                     message:
//                         'Invalid usage of "getElementsByTagName". DOM query at the document level is forbidden.',
//                 },
//                 {
//                     message:
//                         'Invalid usage of "getElementsByTagNameNS". DOM query at the document level is forbidden.',
//                 },
//                 {
//                     message:
//                         'Invalid usage of "getElementsByClassName". DOM query at the document level is forbidden.',
//                 },
//                 {
//                     message:
//                         'Invalid usage of "getElementById". DOM query at the document level is forbidden.',
//                 },
//             ],
//         },
//     ],
// });
