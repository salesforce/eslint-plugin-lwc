/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');

function isInnerHtmlForm(id) {
    return 'innerHTML' === id || 'outerHTML' === id || 'insertAdjacentHTML' === id;
}

module.exports = {
    meta: {
        docs: {
            description: 'disallow usage of "innerHtml"',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-inner-htm'),
        },

        schema: [],
    },

    create(context) {
        return {
            'MemberExpression > Identifier': function (node) {
                if (isInnerHtmlForm(node.name)) {
                    context.report({
                        node: node,
                        message: "Using 'innerHTML/outputHTML/insertAdjacentHTML' is not allowed",
                    });
                }
            },
            'MemberExpression > Literal': function (node) {
                if (isInnerHtmlForm(node.value)) {
                    context.report({
                        node: node,
                        message: "Using 'innerHTML/outputHTML/insertAdjacentHTML' is not allowed",
                    });
                }
            },
        };
    },
};
