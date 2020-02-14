## Enforce wire adapters to be used with `wire` decorator (no-unexpected-wire-adapter-usages)

This rule prevents unexpected wire adapter usage by ensuring that they are only used via the `wire` decorator.

### Rule details

This rule can be configured as follows:

```js
{
    adapters: [
        // for modules exporting wire adapters using named exports
        { module: '<module name>', identifier: '<adapter identifier>' },

        // for modules exporting wire adapters using default exports
        { module: '<module name>', identifier: 'default' },
    ];
}
```

```js
/*eslint lwc/no-unexpected-wire-adapter-usages: ["error", {"adapters": [{"module": "myAdapters", "identifier": "fooAdapter"}]}]*/

import { LightningElement, wire } from 'lwc';
import { fooAdapter } from 'myAdapters';

wire(fooAdapter); // invalid
new fooAdapter(); // invalid
const barAdapter = fooAdapter; // invalid

export default class Example extends LightningElement {
    @wire(fooAdapter) // valid
    foo;
}
```

### Caveats

Namespace import syntax (`import * as ns from 'module';`) are extremely hard to track using static analysis. This rule doesn't track wire adapter usages when they are imported using the namespace import syntax.

```js
/*eslint lwc/no-unexpected-wire-adapter-usages: ["error", {"adapters": [{"module": "myAdapters", "identifier": "fooAdapter"}]}]*/

import * as adapters from 'myAdapters';

new adapter.fooAdapter(); // valid
```
