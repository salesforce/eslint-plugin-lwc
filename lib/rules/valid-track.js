/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { isClassField } = require('../util/isClassField');

const TRACK_DECORATOR_IDENTIFIER = 'track';

module.exports = {
    meta: {
        docs: {
            description: 'validate track decorator usage',
            category: 'LWC',
            recommended: true,
            url: docUrl('valid-track'),
        },

        schema: [],
    },

    create(context) {
        return {
            Decorator(node) {
                const { expression, parent } = node;

                if (
                    expression.type === 'CallExpression' &&
                    expression.callee.type === 'Identifier' &&
                    expression.callee.name === TRACK_DECORATOR_IDENTIFIER
                ) {
                    context.report({
                        node,
                        message: `"@track" decorators don't support argument`,
                    });
                }

                if (
                    expression.type === 'Identifier' &&
                    expression.name === TRACK_DECORATOR_IDENTIFIER
                ) {
                    if (
                        !isClassField(parent) ||
                        (isClassField(parent) && parent.static) ||
                        (isClassField(parent.type) && parent.kind !== undefined)
                    ) {
                        context.report({
                            node,
                            message: '"@track" decorators can only be applied to class fields',
                        });
                    }
                }
            },
        };
    },
};
