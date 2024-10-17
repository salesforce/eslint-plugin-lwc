/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { noUnguardedAsyncSSR } = require('../rule-helpers');
const { docUrl } = require('../util/doc-url');

const asyncOperations = new Set([
    'fetch',
    'then',
    'catch',
    'finally',
    'resolve',
    'reject',
    'all',
    'allSettled',
    'any',
    'race',
]);
const eventOperations = new Set(['addEventListener', 'removeEventListener', 'dispatchEvent']);

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            url: docUrl('no-unguarded-async-event-in-ssr'),
            category: 'LWC',
            description: 'disallow unguarded async operations and eventing during SSR',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    'additional-async-operations': {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    'additional-event-operations': {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
            },
        ],
        messages: {
            unguardedAsyncOperation:
                "Unguarded async operation '{{name}}' is not allowed during SSR. Consider guarding with `import.meta.env.SSR` flag.",
            unguardedEventOperation:
                "Unguarded event operation '{{name}}' is not allowed during SSR. Consider guarding with `import.meta.env.SSR` flag.",
            unguardedAwait:
                "Unguarded 'await' expression is not allowed during SSR. Consider guarding with `import.meta.env.SSR` flag.",
        },
    },
    create: (context) => {
        const options = context.options[0] || {};
        const additionalAsyncOps = new Set(options['additional-async-operations'] || []);
        const additionalEventOps = new Set(options['additional-event-operations'] || []);

        const forbiddenAsyncOps = new Set([...asyncOperations, ...additionalAsyncOps]);
        const forbiddenEventOps = new Set([...eventOperations, ...additionalEventOps]);

        return noUnguardedAsyncSSR(context, forbiddenAsyncOps, forbiddenEventOps);
    },
};
