/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const semver = require('semver');
const eslint = require('eslint');
const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-dupe-class-members');

const ruleTester = new eslint.RuleTester(ESLINT_TEST_CONFIG);

const isEslint7 = semver.satisfies(eslint.version, '^7');

ruleTester.run('no-dupe-class-members', rule, {
    valid: [
        // Original rule tests:
        // https://github.com/eslint/eslint/blob/2c7431d6b32063f74e3837ee727f26af215eada7/tests/lib/rules/no-dupe-class-members.js#L23
        'class A { foo() {} bar() {} }',
        'class A { static foo() {} foo() {} }',
        'class A { get foo() {} set foo(value) {} }',
        'class A { static foo() {} get foo() {} set foo(value) {} }',
        'class A { foo() { } } class B { foo() { } }',
        'class A { [foo]() {} foo() {} }',
        "class A { 'foo'() {} 'bar'() {} baz() {} }",
        "class A { *'foo'() {} *'bar'() {} *baz() {} }",
        "class A { get 'foo'() {} get 'bar'() {} get baz() {} }",
        'class A { 1() {} 2() {} }',

        // Custom logic with class fields
        'class A { foo; bar; }',
        'class A { foo; [foo]; }',
        'class A { foo; bar() {} }',
        'class A { foo; static foo; }',
        'class A { foo; static foo() {} }',
        "class A { 'foo'; static 'foo'; }",
        "class A { 'foo'; static 'foo'() {} }",
        'class A { static foo; static bar; }',
        "class A { static 'foo'; static 'bar'; }",
    ],
    invalid: [
        // Original rule tests:
        // https://github.com/eslint/eslint/blob/2c7431d6b32063f74e3837ee727f26af215eada7/tests/lib/rules/no-dupe-class-members.js#L35
        {
            code: 'class A { foo() {} foo() {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 20,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: '!class A { foo() {} foo() {} };',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 21,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: "class A { 'foo'() {} 'foo'() {} }",
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 22,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: 'class A { 10() {} 1e1() {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 19,
                    messageId: 'unexpected',
                    data: { name: '10' },
                },
            ],
        },
        {
            code: 'class A { foo() {} foo() {} foo() {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 20,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 29,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: 'class A { static foo() {} static foo() {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 27,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: 'class A { foo() {} get foo() {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 20,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: 'class A { set foo(value) {} foo() {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 29,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },

        // Custom logic with class fields
        {
            code: 'class A { foo; foo; }',
            errors: [
                {
                    // In ESLint v7, class fields are called ClassProperty, whereas in ESLint v8,
                    // they're called PropertyDefinition.
                    type: isEslint7 ? 'ClassProperty' : 'PropertyDefinition',
                    line: 1,
                    column: 16,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: 'class A { foo; foo() {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 16,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: 'class A { foo; get foo() {} set foo(v) {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 16,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 29,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: "class A { 'foo'; foo() {} }",
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 18,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
        {
            code: 'class A { static foo; static foo() {} }',
            errors: [
                {
                    type: 'MethodDefinition',
                    line: 1,
                    column: 23,
                    messageId: 'unexpected',
                    data: { name: 'foo' },
                },
            ],
        },
    ],
});
