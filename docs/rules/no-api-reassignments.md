# Prevent public property reassignments (no-api-reassignments)

Public properties should be set by the parent component and never reassigned by the child. This linting rule prevents reassignment of a component's public properties.

## Rule details

Example of **incorrect** code:

```js
import { LightningElement, api } from 'lwc';

export default class Test extends LightningElement {
    @api foo;

    constructor() {
        super();
        this.foo = 1;
    }

    method() {
        this.foo = 1;

        return () => {
            this.foo = 1;
        };
    }
}
```

Example of **correct** code:

```js
export default class Test extends LightningElement {
    @api foo = 1;
}
```

## When not to use it

If the component needs to reflect internal state changes via public property, this rule should not be used. A good example for this is a custom input component reflecting its internal value change to the `value` public property.

## Caveats

This rule suffers from the following caveats:

-   It expects that all the class methods are invoked with the component instance as the `this` value. If a class method is invoked with a different `this` and happens to reassign a property that is also declared as a public property, this rule reports a false positive.
-   It doesn't track public property reassignment when the `this` value is aliased (eg. `const that = this`).
-   It doesn't track public property reassignment where the component instance is passed as argument or as the `this` value using `Function.prototype.call()`, `Function.prototype.apply()` or `Function.prototype.bind()`.
