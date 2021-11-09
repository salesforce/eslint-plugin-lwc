/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { isComponent } = require('../util/component');
const { isClassField } = require('../util/isClassField');

const SUGGESTED_FIX =
    'Use getter/setter on the global HTML attributes to observe attribute changes.';

function isObservedAttributeProperty(node) {
    // class extends LightningElement {
    //      static observedAttributes = ['title]
    // }
    const isStaticPropertyForm =
        isClassField(node) &&
        node.static &&
        !node.computed &&
        node.key.name === 'observedAttributes';

    // class extends LightningElement {
    //      get observedAttributes() { return ['title] }
    // }
    const isStaticGetterForm =
        node.type === 'MethodDefinition' &&
        node.kind === 'get' &&
        node.static &&
        !node.computed &&
        node.key.name === 'observedAttributes';

    return isStaticPropertyForm || isStaticGetterForm;
}

function isAttributeChangedCallback(node) {
    return (
        node.type === 'MethodDefinition' &&
        node.kind === 'method' &&
        !node.static &&
        !node.computed &&
        node.key.name === 'attributeChangedCallback'
    );
}

module.exports = {
    meta: {
        docs: {
            description: 'disallow usage of deprecated LWC APIs',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-deprecated'),
        },

        schema: [],
    },

    create(context) {
        return {
            ClassDeclaration(node) {
                if (!isComponent(node, context)) {
                    return;
                }

                const { body } = node.body;
                for (let property of body) {
                    if (isObservedAttributeProperty(property)) {
                        context.report({
                            node,
                            message: `"observedAttributes" has been deprecated. ${SUGGESTED_FIX}`,
                        });
                    }

                    if (isAttributeChangedCallback(property)) {
                        context.report({
                            node,
                            message: `"attributeChangedCallback" has been deprecated. ${SUGGESTED_FIX}`,
                        });
                    }
                }
            },
        };
    },
};
