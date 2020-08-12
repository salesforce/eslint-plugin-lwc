/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const path = require('path');

const { docUrl } = require('../util/doc-url');
const { isComponent } = require('../util/component');

module.exports = {
    meta: {
        docs: {
            description: 'ensure component class name matches file name',
            category: 'LWC',
            url: docUrl('consistent-component-name'),
        },
        messages: {
            unexpectedName: 'Lightning component class should be named "{{ name }}".',
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        const fileName = context.getFilename();
        const sourceCode = context.getSourceCode();

        const fileBasename = path.basename(fileName, '.js');
        const expectComponentName = fileBasename.charAt(0).toUpperCase() + fileBasename.slice(1);

        return {
            ClassDeclaration(node) {
                if (!isComponent(node, context)) {
                    return;
                }

                const { id } = node;

                const reportUnexpectedName = (fix) => {
                    context.report({
                        node,
                        messageId: 'unexpectedName',
                        data: {
                            name: expectComponentName,
                        },
                        fix,
                    });
                };

                const isAnonymousClass = id === null;
                if (isAnonymousClass) {
                    return reportUnexpectedName((fixer) => {
                        // Find the "class" token in the class declaration AST node and insert
                        // the component name after it.
                        const classToken = sourceCode.getFirstToken(node);
                        return fixer.insertTextAfter(classToken, ` ${expectComponentName}`);
                    });
                }

                const isNamingConsistent = id.name === expectComponentName;
                if (!isNamingConsistent) {
                    return reportUnexpectedName((fixer) => {
                        // Replace the existing class name
                        return fixer.replaceText(id, expectComponentName);
                    });
                }
            },
        };
    },
};
