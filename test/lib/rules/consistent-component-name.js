/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/consistent-component-name');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('consistent-component-name', rule, {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                export class Foo extends LightningElement {}
            `,
            filename: 'foo.js',
        },
        {
            code: `export class ComplexName extends LightningElement {}`,
            filename: 'complexName.js',
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export class Foo extends LightningElement {}
            `,
            filename: 'foo.ts',
        },
        {
            code: `export class ComplexName extends LightningElement {}`,
            filename: 'complexName.ts',
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class extends LightningElement {}
            `,
            filename: 'foo.js',
            errors: [
                {
                    type: 'ClassDeclaration',
                    column: 32,
                    message: 'Lightning component class should be named "Foo".',
                },
            ],
            output: `
                import { LightningElement } from 'lwc';
                export default class Foo extends LightningElement {}
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class Foo extends LightningElement {}
            `,
            filename: 'bar.js',
            errors: [
                {
                    column: 32,
                    type: 'ClassDeclaration',
                    message: 'Lightning component class should be named "Bar".',
                },
            ],
            output: `
                import { LightningElement } from 'lwc';
                export default class Bar extends LightningElement {}
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class ComplexName extends LightningElement {}
            `,
            filename: 'superComplexName.js',
            errors: [
                {
                    column: 32,
                    type: 'ClassDeclaration',
                    message: 'Lightning component class should be named "SuperComplexName".',
                },
            ],
            output: `
                import { LightningElement } from 'lwc';
                export default class SuperComplexName extends LightningElement {}
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                export default class complexName extends LightningElement {}
            `,
            filename: 'complexName.js',
            errors: [
                {
                    column: 32,
                    type: 'ClassDeclaration',
                    message: 'Lightning component class should be named "ComplexName".',
                },
            ],
            output: `
                import { LightningElement } from 'lwc';
                export default class ComplexName extends LightningElement {}
            `,
        },
    ],
});
