## Enforce wire adapters to be used with `wire` decorator (no-unexpected-wire-adapter-usages)

With the [wire reform](https://rfcs.lwc.dev/rfcs/lwc/0000-wire-reform), all the wire adapters can now be invoked programmatically. Ensuring that wire adapters are consumed via the `wire` decorator ensures that their consumption is statically analyzable.

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
