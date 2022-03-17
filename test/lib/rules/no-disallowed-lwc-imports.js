/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-disallowed-lwc-imports');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

const invalidCases = [
    {
        code: `import { ShouldNotImport } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
        ],
    },
    {
        code: `import { ShouldNotImport as LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
        ],
    },
    {
        code: `import { ShouldNotImport, LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
        ],
    },
    {
        code: `import { LightningElement, ShouldNotImport } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
        ],
    },
    {
        code: `import { ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
            {
                message: new RegExp(`Invalid import. "AlsoBanned" is not a known and stable API.`),
            },
        ],
    },
    {
        code: `import { LightningElement, ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
            {
                message: new RegExp(`Invalid import. "AlsoBanned" is not a known and stable API.`),
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
                    `Invalid export. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
        ],
    },
    {
        code: `export { ShouldNotImport as LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
        ],
    },
    {
        code: `export { ShouldNotImport, LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
        ],
    },
    {
        code: `export { LightningElement, ShouldNotImport } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
        ],
    },
    {
        code: `export { ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
            {
                message: new RegExp(`Invalid export. "AlsoBanned" is not a known and stable API.`),
            },
        ],
    },
    {
        code: `export { LightningElement, ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. "ShouldNotImport" is not a known and stable API.`,
                ),
            },
            {
                message: new RegExp(`Invalid export. "AlsoBanned" is not a known and stable API.`),
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
];

ruleTester.run('no-disallowed-lwc-imports', rule, {
    valid: validCases,
    invalid: invalidCases,
});
