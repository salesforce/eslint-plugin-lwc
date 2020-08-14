/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { isGlobalIdentifier } = require('../util/scope');

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
         * Returns true if the passed string is a valid event listener method.
         */
        function isValidEventListenerMethodName(name) {
            return name === 'addEventListener' || name === 'removeEventListener';
        }

        /**
         * Returns the root object of a member expression.
         */
        function getExpressionRootNode(node) {
            switch (node.type) {
                case 'MemberExpression':
                    return getExpressionRootNode(node.object);

                case 'CallExpression':
                    return getExpressionRootNode(node.callee);

                default:
                    return node;
            }
        }

        /**
         * Emits if a given call expression is dealing with an event listener that would leak.
         */
        function reportListenerLeak(callExpression, { method }) {
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
                const detail =
                    method === 'addEventListener'
                        ? 'Make sure to keep a reference to the handler to remove it subsequently.'
                        : 'The passed handler is different than the registered one.';

                context.report({
                    message: `Event listener will leak. ${detail}`,
                    node: callExpression,
                });
            }
        }

        return {
            CallExpression(node) {
                const { callee } = node;
                const scope = context.getScope();

                // Handle cases where the method is attached on the global object:
                // - addEventListener('click', () => {});
                if (
                    callee.type === 'Identifier' &&
                    isGlobalIdentifier(callee, scope) &&
                    isValidEventListenerMethodName(callee.name)
                ) {
                    reportListenerLeak(node, { method: callee.name });
                }

                // Handle cases where invoking the event listener method on an object:
                //  - window.addEventListener('click', () => {});
                //  - document.body.addEventListener('click', () => {});
                //  - document.querySelector('#modal').addEventListener('click', () => {});
                //
                // Note: This routine only track handlers attached to nodes that are access via the
                // "document" or the "window" object to avoid false positives. Event listeners added
                // programmatically on a component element will automatically be garbage collected
                // when the component is destroyed.
                if (
                    callee.type === 'MemberExpression' &&
                    callee.computed === false &&
                    callee.property.type === 'Identifier' &&
                    isValidEventListenerMethodName(callee.property.name)
                ) {
                    const rootNode = getExpressionRootNode(callee);

                    if (
                        rootNode.type === 'Identifier' &&
                        isGlobalIdentifier(rootNode, scope) &&
                        (rootNode.name === 'window' || rootNode.name === 'document')
                    ) {
                        reportListenerLeak(node, {
                            method: callee.property.name,
                        });
                    }
                }
            },
        };
    },
};
