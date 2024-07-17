/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule } = require('../shared');

const invalidCases = [
    {
        code: `import { ShouldNotImport } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `import { ShouldNotImport as LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `import { ShouldNotImport, LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `import { LightningElement, ShouldNotImport } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `import { ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
            {
                message: new RegExp(`Invalid import. "AlsoBanned" can't be imported from "lwc".`),
            },
        ],
    },
    {
        code: `import { LightningElement, ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
            {
                message: new RegExp(`Invalid import. "AlsoBanned" can't be imported from "lwc".`),
            },
        ],
    },
    {
        code: `import * as lwc from 'lwc'`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. Namespace imports are not allowed on "lwc". Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                ),
            },
        ],
    },
    {
        code: `export * from 'lwc'`,
        errors: [
            {
                message: new RegExp(`Invalid export. Exporting from "lwc" is not allowed.`),
            },
        ],
    },
    {
        code: `export * as foo from 'lwc'`,
        errors: [
            {
                message: new RegExp(`Invalid export. Exporting from "lwc" is not allowed.`),
            },
        ],
    },
    {
        code: `import 'lwc'`,
        errors: [
            {
                message: new RegExp(`Invalid import. Bare imports are not allowed on "lwc".`),
            },
        ],
    },
    {
        code: `import lwc from 'lwc'`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "lwc" does not have a default export. Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                ),
            },
        ],
    },
    {
        code: `import lwc, { LightningElement } from 'lwc'`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "lwc" does not have a default export. Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                ),
            },
        ],
    },
    {
        code: `export { ShouldNotImport } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `export { ShouldNotImport as LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `export { ShouldNotImport, LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `export { LightningElement, ShouldNotImport } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `export { ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
            {
                message: new RegExp(`Invalid export. "AlsoBanned" can't be imported from "lwc".`),
            },
        ],
    },
    {
        code: `export { LightningElement, ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" can't be imported from "lwc".`,
                ),
            },
            {
                message: new RegExp(`Invalid export. "AlsoBanned" can't be imported from "lwc".`),
            },
        ],
    },
    {
        code: `export {} from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. Bare exports are not allowed on "lwc". Instead, use named exports: "export { LightningElement } from 'lwc'".`,
                ),
            },
        ],
    },

    {
        code: `import { LightningElement } from "lwc"`,
        options: [
            {
                allowlist: [],
            },
        ],
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "LightningElement" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `export { LightningElement } from "lwc"`,
        options: [
            {
                allowlist: [],
            },
        ],
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "LightningElement" can't be imported from "lwc".`,
                ),
            },
        ],
    },
    {
        code: `import { api } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement'],
            },
        ],
        errors: [
            {
                message: new RegExp(`Invalid import. "api" can't be imported from "lwc".`),
            },
        ],
    },
    {
        code: `import { Unknown as LightningElement } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement'],
            },
        ],
        errors: [
            {
                message: new RegExp(`Invalid import. "Unknown" can't be imported from "lwc".`),
            },
        ],
    },
    {
        code: `export { api } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement'],
            },
        ],
        errors: [
            {
                message: new RegExp(`Invalid export. "api" can't be imported from "lwc".`),
            },
        ],
    },
    {
        code: `export { Unknown as LightningElement } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement'],
            },
        ],
        errors: [
            {
                message: new RegExp(`Invalid export. "Unknown" can't be imported from "lwc".`),
            },
        ],
    },
];

const validCases = [
    {
        code: `import { LightningElement } from "lwc"`,
    },
    {
        code: `import { LightningElement, wire } from "lwc"`,
    },
    {
        code: `import { LightningElement, wire, api } from "lwc"`,
    },
    {
        code: `import { LightningElement as Yolo } from "lwc"`,
    },
    {
        code: `import "some-other-package"`,
    },
    {
        code: `import * as foo from "some-other-package"`,
    },
    {
        code: `import { foo } from "some-other-package"`,
    },
    {
        code: `export * as foo from "some-other-package"`,
    },
    {
        code: `export * from "some-other-package"`,
    },
    {
        code: `export { foo } from "some-other-package"`,
    },
    {
        code: `export { LightningElement } from "lwc"`,
    },
    {
        code: `export { LightningElement, wire } from "lwc"`,
    },
    {
        code: `export { LightningElement, wire, api } from "lwc"`,
    },
    {
        code: `export { LightningElement as Yolo } from "lwc"`,
    },
    {
        code: `export {} from "some-other-package"`,
    },
    {
        code: `export { LightningElement as default } from "lwc"`,
    },
    {
        code: `export function foo() {}`,
    },
    {
        code: `export default function () {}`,
    },
    {
        code: `export default function foo() {}`,
    },
    {
        code: `export const foo = 'foo'`,
    },
    {
        code: `export default 'foo'`,
    },

    {
        code: `import { LightningElement } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement', 'api'],
            },
        ],
    },
    {
        code: `import { LightningElement as LWCElement } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement', 'api'],
            },
        ],
    },
    {
        code: `import { LightningElement, api } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement', 'api'],
            },
        ],
    },
    {
        code: `export  { LightningElement } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement', 'api'],
            },
        ],
    },
    {
        code: `export  { LightningElement, api } from "lwc"`,
        options: [
            {
                allowlist: ['LightningElement', 'api'],
            },
        ],
    },
    {
        code: `import 'lwc'`,
        options: [
            {
                allowBareImports: true,
            },
        ],
    },
    {
        code: `export  { LightningElement } from "lwc"`,
        options: [
            {
                allowExports: true,
            },
        ],
    },
    {
        code: `export  { doesNotExist } from "lwc"`,
        options: [
            {
                allowExports: true,
            },
        ],
    },
    {
        code: `export {} from 'lwc'`,
        options: [
            {
                allowExports: true,
            },
        ],
    },
    {
        code: `export * as foo from 'lwc'`,
        options: [
            {
                allowExports: true,
            },
        ],
    },
    {
        code: `export * from 'lwc'`,
        options: [
            {
                allowExports: true,
            },
        ],
    },
];

testRule('no-disallowed-lwc-imports', {
    valid: validCases,
    invalid: invalidCases,
});
