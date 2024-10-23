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

### Example of **incorrect** code:

```js
// Do not use Node APIs
```
