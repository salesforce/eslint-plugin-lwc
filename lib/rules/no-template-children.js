/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

const disallowedProperties = new Set([
    'children',
    'childNodes',
    'firstChild',
    'firstElementChild',
    'lastChild',
    'lastElementChild',
]);

/**
 * Returns true if this is a `this.template` expression
 */
function isThisDotTemplateExpression(node) {
    return (
        node.type === 'MemberExpression' &&
        node.computed === false &&
        node.object.type === 'ThisExpression' &&
        node.property.type === 'Identifier' &&
        node.property.name === 'template'
    );
}

/**
 * Returns true if this is an ObjectExpression property that should be disallowed for `this.template`
 * E.g.: `const { firstChild } = this.template`
 */
function propertyIsDisallowedForThisDotTemplate(prop) {
    return prop.key.type === 'Identifier' && disallowedProperties.has(prop.key.name);
}

/**
 * Returns true if this is an ObjectExpression property that should be disallowed for `this`
 * E.g.: `const { template: { firstChild } } = this`
 */
function propertyIsDisallowedForThis(prop) {
    const { key, value } = prop;
    return (
        key.type === 'Identifier' &&
        key.name === 'template' &&
        value.type === 'ObjectPattern' &&
        value.properties.some(propertyIsDisallowedForThisDotTemplate)
    );
}

module.exports = {
    meta: {
        docs: {
            description: 'prevent accessing the immediate children of this.template',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-template-children'),
        },

        schema: [],
    },

    create(context) {
        return {
            ThisExpression(node) {
                const { parent } = node;
                const { parent: grandparent } = parent;

                if (
                    isThisDotTemplateExpression(parent) &&
                    grandparent.type === 'MemberExpression' &&
                    grandparent.property.type === 'Identifier' &&
                    disallowedProperties.has(grandparent.property.name)
                ) {
                    // E.g.: `const child = this.template.firstChild`

                    context.report({
                        message: `Accessing ${grandparent.property.name} on this.template is unsafe`,
                        node: grandparent.property,
                    });
                } else if (
                    isThisDotTemplateExpression(parent) &&
                    grandparent.type === 'VariableDeclarator' &&
                    grandparent.id.type === 'ObjectPattern' &&
                    grandparent.init === parent &&
                    grandparent.id.properties.some(propertyIsDisallowedForThisDotTemplate)
                ) {
                    // E.g.: `const { firstChild } = this.template`

                    const property = grandparent.id.properties.find(
                        propertyIsDisallowedForThisDotTemplate,
                    );
                    context.report({
                        message: `Accessing ${property.key.name} on this.template is unsafe`,
                        node: property,
                    });
                } else if (
                    parent.type === 'VariableDeclarator' &&
                    parent.id.type === 'ObjectPattern' &&
                    parent.init === node &&
                    parent.id.properties.some(propertyIsDisallowedForThis)
                ) {
                    // E.g.: `const { template: { firstChild } } = this`

                    const thisProperty = parent.id.properties.find(propertyIsDisallowedForThis);
                    const templateProperty = thisProperty.value.properties.find(
                        propertyIsDisallowedForThisDotTemplate,
                    );

                    context.report({
                        message: `Accessing ${templateProperty.key.name} on this.template is unsafe`,
                        node: templateProperty,
                    });
                }
            },
        };
    },
};
