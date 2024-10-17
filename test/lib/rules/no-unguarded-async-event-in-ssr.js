/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-unguarded-async-event-in-ssr', {
    valid: [
        {
            code: `if (!import.meta.env.SSR) { fetch('/api/data'); }`,
        },
        {
            code: `async function fetchData() { if (!import.meta.env.SSR) { await fetch('/api/data'); } }`,
        },
        {
            code: `if (!import.meta.env.SSR) { window.addEventListener('click', () => console.log('Clicked')); }`,
        },
        {
            code: `if (!import.meta.env.SSR) { const response = fetch('/api/data'); }`,
        },
        {
            code: `setTimeout(() => { console.log('Hello'); }, 1000);`, // This should still be valid
        },
        {
            code: `if (!import.meta.env.SSR) { new Promise((resolve) => resolve('test')); }`,
        },
        {
            code: `if (!import.meta.env.SSR) { somePromise.then(() => {}).catch(() => {}); }`,
        },
        {
            code: `if (!import.meta.env.SSR) { this.dispatchEvent(new CustomEvent('myevent')); }`,
        },
        {
            code: `
                try {
                        // Synchronous operation
                        const data = JSON.parse('{ "key": "value" }');
                        console.log(data.key); // This is just synchronous processing
                    } catch (e) {
                        console.error('Error parsing JSON:', e); // Regular error handling, no async operation
                    } finally {
                        console.log('Done processing'); // Synchronous cleanup, no async operation
                }`,
        },
    ],
    invalid: [
        {
            code: `async function fetchData() { const response = await fetch('/api/data'); }`,
            errors: [{ messageId: 'unguardedAwait' }, { messageId: 'unguardedAsyncOperation' }],
        },
        {
            code: `fetch('/api/data');`,
            errors: [{ messageId: 'unguardedAsyncOperation' }],
        },
        {
            code: `window.addEventListener('click', () => { console.log('Clicked'); });`,
            errors: [{ messageId: 'unguardedEventOperation' }],
        },
        {
            code: `async function getData() { return await fetch('/api/data'); }`,
            errors: [{ messageId: 'unguardedAwait' }, { messageId: 'unguardedAsyncOperation' }],
        },
        {
            code: `if (someCondition) { fetch('/api/data'); }`,
            errors: [{ messageId: 'unguardedAsyncOperation' }],
        },
        {
            code: `if (someCondition) { async function fetchData() { const response = await fetch('/api/data'); } }`,
            errors: [{ messageId: 'unguardedAwait' }, { messageId: 'unguardedAsyncOperation' }],
        },
        {
            code: `new Promise((resolve) => resolve('test'));`,
            errors: [{ messageId: 'unguardedAsyncOperation' }],
        },
        {
            code: `this.dispatchEvent(new CustomEvent('myevent'));`,
            errors: [{ messageId: 'unguardedEventOperation' }],
        },
    ],
});

testTypeScript('no-unguarded-async-event-in-ssr', {
    valid: [
        {
            code: `if (!import.meta.env.SSR) { fetch('/api/data'); }`,
        },
        {
            code: `async function fetchData(): Promise<void> { if (!import.meta.env.SSR) { await fetch('/api/data'); } }`,
        },
        {
            code: `const a: number = 5; const b: number = 10; const total: number = a + b;`,
        },
        {
            code: `if (!import.meta.env.SSR) { const asyncOp = async (): Promise<string> => { return 'test'; }; }`,
        },
        {
            code: `const asyncOp = async (): Promise<string> => { return !import.meta.env.SSR ? await Promise.resolve('test') : 'default value'; };`,
        },
        {
            code: `if (!import.meta.env.SSR) { removeEventListener('click', handleClick); }`,
        },
        {
            code: `if (!import.meta.env.SSR) { dispatchEvent(new CustomEvent('myEvent', { detail: { key: 'value' } })); }`,
        },
    ],
    invalid: [
        {
            code: `async function fetchData(): Promise<Response> { const response = await fetch('/api/data'); return response; }`,
            errors: [{ messageId: 'unguardedAwait' }, { messageId: 'unguardedAsyncOperation' }],
        },
        {
            code: `const asyncOp = async (): Promise<string> => { return await Promise.resolve('test'); };`,
            errors: [{ messageId: 'unguardedAwait' }],
        },
        {
            code: `class TestClass { async testMethod(): Promise<void> { await fetch('/api/data'); } }`,
            errors: [{ messageId: 'unguardedAwait' }, { messageId: 'unguardedAsyncOperation' }],
        },
        {
            code: `removeEventListener('click', handleClick);`,
            errors: [{ messageId: 'unguardedEventOperation' }],
        },
        {
            code: `dispatchEvent(new CustomEvent('myEvent', { detail: { key: 'value' } }));`,
            errors: [{ messageId: 'unguardedEventOperation' }],
        },
        {
            code: `function setup() { window.addEventListener('click', () => { console.log('Clicked!'); }); } setup();`,
            errors: [{ messageId: 'unguardedEventOperation' }],
        },
    ],
});
