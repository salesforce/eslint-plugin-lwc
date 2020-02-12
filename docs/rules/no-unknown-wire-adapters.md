## Disallow usage of unknown wire adapters (no-unknown-wire-adapters)

This rule offers a way to restrict the usage of unexpected wire adapters. It can be used to ensure that all the LWC components wired properties are statically analyzable (for example for prefetching or offline purposes).

## Rule details

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

By default the list of known adapters is empty. So all the `@wire` decorator usages will be flagged as an error.

```js
/*eslint lwc/no-unexpected-wire-adapters: ["error", {"adapters": [{"module": "myAdapters", "identifier": "fooAdapter"}]}]*/

import { LightningElement, wire } from 'lwc';
import defaultAdapter, { fooAdapter, barAdapter } from 'myAdapters';

export default class Example extends LightningElement {
    @wire(fooAdapter) // valid
    foo;

    @wire(barAdapter) // invalid, missing adapter in config: {"module": "myAdapters", "identifier": "barAdapter"}
    bar;

    @wire(defaultAdapter) // invalid, missing adapter in config: {"module": "myAdapters", "identifier": "default"}
    default;
}
```
