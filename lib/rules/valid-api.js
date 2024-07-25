/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { API_DECORATOR_IDENTIFIER, isApiDecorator } = require('../util/decorator');
const { isClassField } = require('../util/isClassField');

/**
 * Set of APIs that we reserved for forward compatibility of LWC.
 */
const RESERVED_PUBLIC_PROPERTIES = new Set(['slot', 'part', 'dataset']);

/**
 * Maps containing attributes that have a camelCased property mapping. We do not want users
 * to define @api properties with these names since the engine will use the camelCased version.
 */
const AMBIGUOUS_ATTRIBUTES = new Map([
    ['bgcolor', 'bgColor'],
    ['accesskey', 'accessKey'],
    ['contenteditable', 'contentEditable'],
    ['contextmenu', 'contextMenu'],
    ['tabindex', 'tabIndex'],
    ['maxlength', 'maxLength'],
    ['maxvalue', 'maxValue'],
]);

/**
 * Disallow a mix of uppercase and underscore characters when defining API properties
 */
const MIX_UPPERCASE_AND_UNDERSCORE = /(?=.*_).*[A-Z]/;

function validateUniqueness(classBody, context) {
    const { body } = classBody;

    const publicProperties = body.filter(
        (property) => property.decorators && property.decorators.some(isApiDecorator),
    );

    const seenPublicProperties = new Set();
    for (let property of publicProperties) {
        const { key } = property;
        if (key && key.type === 'Identifier') {
            const { name } = key;
            if (!seenPublicProperties.has(name)) {
                seenPublicProperties.add(name);
            } else {
                context.report({
                    node: property,
                    message: `"${name}" has already been declared as a public property.`,
                });
            }
        }
    }
}

function validatePropertyName(property, context) {
    const { name } = property;

    if (name.startsWith('on') && name === name.toLowerCase()) {
        context.report({
            node: property,
            message: `Invalid public property "${name}". Properties starting with "on" are reserved for event handlers.`,
        });
    }

    if (RESERVED_PUBLIC_PROPERTIES.has(name)) {
        context.report({
            node: property,
            message: `Invalid public property "${name}". This property name is a reserved property.`,
        });
    } else if (/^data[A-Z]/.test(name)) {
        context.report({
            node: property,
            message: `Invalid public property name "${name}". Properties starting with "data" correspond to data-* HTML attributes, which are not allowed.`,
        });
    }

    if (AMBIGUOUS_ATTRIBUTES.has(name)) {
        const message = [
            `Ambiguous public property "${name}".`,
            `Consider renaming the property to it's camelCased version "${AMBIGUOUS_ATTRIBUTES.get(
                name,
            )}".`,
        ].join(' ');
        context.report({
            node: property,
            message,
        });
    }

    if (context.options[0] && context.options[0].disallowUnderscoreUppercaseMix) {
        if (name.match(MIX_UPPERCASE_AND_UNDERSCORE)) {
            context.report({
                node: property,
                message: `Avoid using both uppercase and underscores in property names: "${name}"`,
            });
        }
    }
}

function validatePropertyValue(property, value, context) {
    const { name } = property;

    if (value.type === 'Literal' && value.raw === 'true') {
        const message = [
            `Invalid public property initialization for "${name}". Boolean public properties should not be initialized to "true",`,
            `consider initializing the property to "false".`,
        ].join(' ');

        context.report({
            node: value,
            message,
        });
    }
}

module.exports = {
    meta: {
        docs: {
            description: 'validate api decorator usage',
            category: 'LWC',
            recommended: true,
            url: docUrl('valid-api'),
        },

        schema: [
            {
                type: 'object',
                properties: {
                    disallowUnderscoreUppercaseMix: {
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        return {
            ClassBody(node) {
                validateUniqueness(node, context);
            },

            Decorator(node) {
                const { expression, parent } = node;

                if (
                    expression.type === 'CallExpression' &&
                    expression.callee.type === 'Identifier' &&
                    expression.callee.name === API_DECORATOR_IDENTIFIER
                ) {
                    context.report({
                        node,
                        message: `"@api" decorators don't support argument.`,
                    });
                }

                if (isApiDecorator(node)) {
                    if (parent.key.type === 'Identifier') {
                        validatePropertyName(parent.key, context);
                    }

                    if (parent.key.type === 'Identifier' && isClassField(parent) && parent.value) {
                        validatePropertyValue(parent.key, parent.value, context);
                    }

                    if (parent.static) {
                        context.report({
                            node,
                            message:
                                '"@api" decorators can only be applied to class fields and methods.',
                        });
                    }
                }
            },
        };
    },
};
