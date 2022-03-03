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
                message: new RegExp(`Invalid import. ShouldNotImport is not part of the lwc api.`),
            },
        ],
    },
    {
        code: `import { ShouldNotImport as LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(`Invalid import. ShouldNotImport is not part of the lwc api.`),
            },
        ],
    },
    {
        code: `import { ShouldNotImport, LightningElement } from "lwc"`,
        errors: [
            {
                message: new RegExp(`Invalid import. ShouldNotImport is not part of the lwc api.`),
            },
        ],
    },
    {
        code: `import { LightningElement, ShouldNotImport } from "lwc"`,
        errors: [
            {
                message: new RegExp(`Invalid import. ShouldNotImport is not part of the lwc api.`),
            },
        ],
    },
    {
        code: `import { ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(`Invalid import. ShouldNotImport is not part of the lwc api.`),
            },
            {
                message: new RegExp(`Invalid import. AlsoBanned is not part of the lwc api.`),
            },
        ],
    },
    {
        code: `import { LightningElement, ShouldNotImport, AlsoBanned } from "lwc"`,
        errors: [
            {
                message: new RegExp(`Invalid import. ShouldNotImport is not part of the lwc api.`),
            },
            {
                message: new RegExp(`Invalid import. AlsoBanned is not part of the lwc api.`),
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
                message: new RegExp(
                    `Invalid export. Exporting from "lwc" is not allowed. Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                ),
            },
        ],
    },
    {
        code: `export * as foo from 'lwc'`,
        errors: [
            {
                message: new RegExp(
                    `Invalid export. Exporting from "lwc" is not allowed. Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                ),
            },
        ],
    },
    {
        code: `import 'lwc'`,
        errors: [
            {
                message: new RegExp(
                    `Invalid import. Bare imports are not allowed on "lwc". Instead, use named imports: "import { LightningElement } from 'lwc'".`,
                ),
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
];

ruleTester.run('no-disallowed-lwc-imports', rule, {
    valid: validCases,
    invalid: invalidCases,
});
