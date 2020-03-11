/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        docs: {
            description: 'prevent event listeners from leaking memory',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-leaky-event-listeners'),
        },

        schema: [],
    },

    create(context) {
        /**
         * Returns true if the passed identifier node is referencing a property on the global
         * object.
         */
        function isIdentifierGlobal(identifier) {
            let scope = context.getScope(identifier);

            while (scope.upper) {
                scope = scope.upper;
            }

            return scope.through.find(variable => variable.identifier === identifier);
        }

        /**
         * Returns true if the passed string is a valid event listener method.
         */
        function isValidEventListenerMethodName(name) {
            return name === 'addEventListener' || name === 'removeEventListener';
        }

        /**
         * Emits if a given call expression is dealing with an event listener that would leak.
         */
        function reportListenerLeak(callExpression, { target, method }) {
            // Early exit if the considered EventTarget is not the document or the window. Event
            // listeners added programmatically on a component element will automatically be
            // garbage collected when the component is destroyed.
            if (target !== 'window' && target !== 'document') {
                return;
            }

            if (callExpression.arguments.length < 2) {
                return;
            }

            // The following handlers are considered leaky because they create a brand new function
            // every time:
            // - addEventListener('click', function () {});
            // - addEventListener('click', () => {});
            // - addEventListener('click', handler.bind(context));
            const handler = callExpression.arguments[1];
            if (
                handler.type === 'ArrowFunctionExpression' ||
                handler.type === 'FunctionExpression' ||
                (handler.type === 'CallExpression' &&
                    handler.callee.type === 'MemberExpression' &&
                    handler.callee.computed === false &&
                    handler.callee.property.type === 'Identifier' &&
                    handler.callee.property.name === 'bind')
            ) {
                const message =
                    method === 'addEventListener'
                        ? 'Event listener will leak. Make sure keep a reference to the handler to remove it later.'
                        : 'Event listener will leak. The passed handler is different than the registered one.';

                context.report({
                    message,
                    node: callExpression,
                });
            }
        }

        return {
            CallExpression(node) {
                const { callee } = node;

                // Handle cases where the method is attached on the global object. eg:
                // addEventListener('click', () => {});
                if (
                    callee.type === 'Identifier' &&
                    isIdentifierGlobal(callee) &&
                    isValidEventListenerMethodName(callee.name)
                ) {
                    reportListenerLeak(node, { target: 'window', method: callee.name });
                }

                // Handle cases where invoking the event listener method on an object. eg:
                // window.addEventListener('click', () => {});
                if (
                    callee.type === 'MemberExpression' &&
                    callee.computed === false &&
                    callee.object.type === 'Identifier' &&
                    isIdentifierGlobal(callee.object) &&
                    callee.property.type === 'Identifier' &&
                    isValidEventListenerMethodName(callee.property.name)
                ) {
                    reportListenerLeak(node, {
                        target: callee.object.name,
                        method: callee.property.name,
                    });
                }
            },
        };
    },
};
