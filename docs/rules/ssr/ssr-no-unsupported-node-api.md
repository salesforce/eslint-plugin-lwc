# Disallow Node API Calls in SSR Context (`lwc/ssr-no-unsupported-node-api`)

This rule disallows the use of unsupported Node API calls within components that may run during server-side rendering. These APIs are not available in client-side rendering environments and can lead to serious issues when used without proper safeguards. To avoid unexpected behavior and security vulnerabilities, certain problematic Node APIs should not be used in SSR contexts.

## Blocked Node APIs

The following Node APIs are disallowed in SSR contexts:

-   `require`
-   `fs`
-   `child_process`
-   `worker_threads`
-   `perf_hooks`

## Rule Details

The purpose of this rule is to prevent the use of dangerous Node API calls in SSR contexts. If you must perform these operations, ensure they are only executed in environments where they are supported.

### Example of **incorrect** code:

```js
const fs = require('fs');

if (import.meta.env.SSR) {
    // unsupported Node API call within SSR context
    fs.writeFileSync('file.txt', 'data');
}
```

### Example of **correct** code:

```js
if (!import.meta.env.SSR) {
    // Client-side code: Safe to use Node APIs here if necessary
    const fs = require('fs'); // Example of a Node API (e.g., for file operations)

    // Your Node API logic goes here, which will only run on the client-side
    fs.writeFileSync('file.txt', 'client-side data');
} else {
    // SSR : Do not use Node APIs here
    console.log('Running in SSR context, Node APIs are not available.');
}
```
