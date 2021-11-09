/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { isComponent } = require('../util/component');
const { docUrl } = require('../util/doc-url');
const { isClassField } = require('../util/isClassField');

// https://github.com/salesforce/lwc/blob/6e6ad1011887d842e3f03546c6a81e9cee057611/packages/%40lwc/shared/src/aria.ts#L10-L67
const ARIA_PROPERTY_NAMES = [
    'ariaActiveDescendant',
    'ariaAtomic',
    'ariaAutoComplete',
    'ariaBusy',
    'ariaChecked',
    'ariaColCount',
    'ariaColIndex',
    'ariaColSpan',
    'ariaControls',
    'ariaCurrent',
    'ariaDescribedBy',
    'ariaDetails',
    'ariaDisabled',
    'ariaErrorMessage',
    'ariaExpanded',
    'ariaFlowTo',
    'ariaHasPopup',
    'ariaHidden',
    'ariaInvalid',
    'ariaKeyShortcuts',
    'ariaLabel',
    'ariaLabelledBy',
    'ariaLevel',
    'ariaLive',
    'ariaModal',
    'ariaMultiLine',
    'ariaMultiSelectable',
    'ariaOrientation',
    'ariaOwns',
    'ariaPlaceholder',
    'ariaPosInSet',
    'ariaPressed',
    'ariaReadOnly',
    'ariaRelevant',
    'ariaRequired',
    'ariaRoleDescription',
    'ariaRowCount',
    'ariaRowIndex',
    'ariaRowSpan',
    'ariaSelected',
    'ariaSetSize',
    'ariaSort',
    'ariaValueMax',
    'ariaValueMin',
    'ariaValueNow',
    'ariaValueText',
    'role',
];

// https://github.com/salesforce/lwc/blob/6e6ad1011887d842e3f03546c6a81e9cee057611/packages/%40lwc/engine-core/src/framework/attributes.ts#L9-L20
const LWC_DEFAULT_PROPERTY_NAMES = [
    'accessKey',
    'dir',
    'draggable',
    'hidden',
    'id',
    'lang',
    'spellcheck',
    'tabIndex',
    'title',
];

const PROPERTIES_THAT_REFLECT = new Set([...ARIA_PROPERTY_NAMES, ...LWC_DEFAULT_PROPERTY_NAMES]);

function getAccessorMethodNames(bodyItems) {
    return bodyItems
        .filter(
            ({ computed, kind, type }) =>
                type === 'MethodDefinition' && (kind === 'get' || kind === 'set') && !computed,
        )
        .map(({ key }) => key.name);
}

function getClassPropertyNames(bodyItems) {
    return bodyItems
        .filter((node) => isClassField(node) && !node.computed)
        .map(({ key }) => key.name);
}

function getAssignmentExpressions(bodyItems) {
    return bodyItems
        .filter(
            ({ expression, type }) =>
                type === 'ExpressionStatement' && expression.type === 'AssignmentExpression',
        )
        .map(({ expression }) => expression);
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'no attributes during construction',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-attributes-during-construction'),
        },
        schema: [],
    },

    create(context) {
        return {
            'MethodDefinition[kind=constructor]': function (ctorMethod) {
                const classBody = ctorMethod.parent;

                // classBody.parent is ClassDeclaration or ClassExpression
                if (!isComponent(classBody.parent, context)) {
                    return;
                }

                const blockStatement = ctorMethod.value.body;
                const assignmentExpressions = getAssignmentExpressions(blockStatement.body);

                if (assignmentExpressions.length !== 0) {
                    const classPropertyNameSet = new Set(getClassPropertyNames(classBody.body));
                    const accessorMethodNameSet = new Set(getAccessorMethodNames(classBody.body));

                    for (const expression of assignmentExpressions) {
                        const { left } = expression;
                        const { computed, object, property } = left;
                        if (object && object.type === 'ThisExpression' && !computed) {
                            const { name } = property;
                            if (
                                PROPERTIES_THAT_REFLECT.has(name) &&
                                !classPropertyNameSet.has(name) &&
                                !accessorMethodNameSet.has(name)
                            ) {
                                context.report({
                                    message: `Invariant violation: Setting "${name}" in the constructor results in a rendered attribute during construction. Change the name of this property, move this assignment to another lifecycle method, or override the default behavior by defining "${name}" as a property on the class.`,
                                    node: expression,
                                });
                            }
                        }
                    }
                }
            },
        };
    },
};
