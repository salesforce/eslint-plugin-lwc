# Disallow unguarded risky Node API calls in SSR context (`lwc/no-unguarded-risky-node-api-in-ssrable-components`)

The rule disallows the use of unguarded risky Node API calls within the context of server-side rendering. These calls can lead to security vulnerabilities and unexpected behavior when rendering components on the server. Instead, any risky operations should be properly guarded to ensure they are only executed in safe contexts.

## Rule details

Example of **incorrect** code:

```js
const fs = require('fs');

if (import.meta.env.SSR) {
    // Risky Node API call within SSR context
    fs.writeFileSync('file.txt', 'data');
}
```

Example of **correct** code:

```js
if (import.meta.env.SSR) {
    try {
        // Safe guarded call
        require('something');
    } catch (e) {
        // Handle error
    }
}
```
