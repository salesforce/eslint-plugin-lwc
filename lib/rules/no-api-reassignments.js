/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
const { getPublicProperties } = require('../util/decorator');

module.exports = {
    meta: {
        docs: {
            description: 'prevent public property reassignments',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-api-reassignments'),
        },
        schema: [],
    },

    create(context) {
        /**
         * Tracks the public properties that are accessible from the current scope.
         */
        let classScope = null;

        /**
         * Creates and pushes a new class scope onto the stack for the given class body.
         */
        function enterClassBody(node) {
            classScope = {
                upper: classScope,
                publicProperties: getPublicProperties(node),
            };
        }

        /**
         * Pops the current class scope from the stack.
         */
        function exitClassBody() {
            classScope = classScope.upper;
        }

        /**
         * Creates and pushes a new empty class scope if the given function declaration is not a
         * method declaration on the class.
         */
        function enterFunction(node) {
            if (node.parent.type !== 'MethodDefinition') {
                classScope = {
                    upper: classScope,
                    publicProperties: [],
                };
            }
        }

        /**
         * Pops the current class scope from the stack, if the given function declaration is not a
         * method declaration on the class.
         */
        function exitFunction(node) {
            if (node.parent.type !== 'MethodDefinition') {
                classScope = classScope.upper;
            }
        }

        /**
         * Emits a message if the given assignment expression is done on public property present
         * in the current scope.
         */
        function reportReassignment(node) {
            // Early exit if the assignment is not on property assigned to the this value.
            if (
                node.left.type !== 'MemberExpression' ||
                node.left.object.type !== 'ThisExpression' ||
                node.left.property.type !== 'Identifier'
            ) {
                return;
            }

            // Check if reassigned property is public property available in the current scope.
            const propertyName = node.left.property.name;
            if (
                classScope &&
                classScope.publicProperties.some(
                    (prop) => prop.name === propertyName && prop.type !== 'method',
                )
            ) {
                context.report({
                    message: `Invalid reassignment of public property "${propertyName}"`,
                    node,
                });
            }
        }

        return {
            AssignmentExpression: reportReassignment,
            ClassBody: enterClassBody,
            'ClassBody:exit': exitClassBody,
            FunctionDeclaration: enterFunction,
            'FunctionDeclaration:exit': exitFunction,
            FunctionExpression: enterFunction,
            'FunctionExpression:exit': exitFunction,
        };
    },
};
