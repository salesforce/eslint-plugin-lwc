/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

/**
 * Code inspired form: https://github.com/eslint/eslint/blob/2c7431d6b32063f74e3837ee727f26af215eada7/lib/rules/no-dupe-class-members.js
 * Author: Toru Nagashima
 * Copyright JS Foundation and other contributors, https://js.foundation
 */
module.exports = {
    meta: {
        docs: {
            description: 'disallow duplicate class members',
            category: 'LWC',
            url: docUrl('no-dupe-class-members'),
        },
        schema: [],
        messages: {
            unexpected: "Duplicate name '{{name}}'.",
        },

        deprecated: true,
        replacedBy: ['no-dupe-class-members'],
    },

    create(context) {
        let stack = [];

        /**
         * Gets state of a given member name.
         * @param {string} name - A name of a member.
         * @param {boolean} isStatic - A flag which specifies if a member is static.
         * @returns {Object} A state of a given member name.
         *   - retv.init {boolean} A flag which shows that the name is declared as normal member.
         *   - retv.get {boolean} A flag which shows that the name is declared as getter.
         *   - retv.set {boolean} A flag which shows that the name is declared as setter.
         */
        function getState(name, isStatic) {
            const stateMap = stack[stack.length - 1];
            const key = `$${name}`; // to avoid "__proto__".

            if (!stateMap[key]) {
                stateMap[key] = {
                    nonStatic: { init: false, get: false, set: false },
                    static: { init: false, get: false, set: false },
                };
            }

            return stateMap[key][isStatic ? 'static' : 'nonStatic'];
        }

        function getName(node) {
            switch (node.type) {
                case 'Identifier':
                    return node.name;
                case 'Literal':
                    return String(node.value);

                /* istanbul ignore next */
                default:
                    return '';
            }
        }

        function PropertyDefinition(node) {
            if (node.computed) {
                return;
            }

            const name = getName(node.key);
            const state = getState(name, node.static);
            const isDuplicate = state.init || state.get || state.set;

            state.init = true;

            if (isDuplicate) {
                context.report({ node, messageId: 'unexpected', data: { name } });
            }
        }

        return {
            Program() {
                stack = [];
            },

            // Initializes state of member declarations for the class.
            ClassBody() {
                stack.push(Object.create(null));
            },

            // Disposes the state for the class.
            'ClassBody:exit'() {
                stack.pop();
            },

            MethodDefinition(node) {
                if (node.computed) {
                    return;
                }

                const name = getName(node.key);
                const state = getState(name, node.static);
                let isDuplicate = false;

                if (node.kind === 'get') {
                    isDuplicate = state.init || state.get;
                    state.get = true;
                } else if (node.kind === 'set') {
                    isDuplicate = state.init || state.set;
                    state.set = true;
                } else {
                    isDuplicate = state.init || state.get || state.set;
                    state.init = true;
                }

                if (isDuplicate) {
                    context.report({ node, messageId: 'unexpected', data: { name } });
                }
            },
            // In ESLint v7, class fields are called ClassProperty, whereas in ESLint v8,
            // they're called PropertyDefinition.
            PropertyDefinition,
            ClassProperty: PropertyDefinition,
        };
    },
};
