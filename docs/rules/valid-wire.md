# Validate `wire` decorator usage (valid-wire)

The following restrictions apply to the `@wire` decorator:

-   Apply the `wire` decorator to class fields and class methods only.
-   The first argument of `@wire` must be an identifier.
-   The second argument of `@wire` is optional. If it's present, it must be an object literal.

## Rule details

Example of **incorrect** code:

```js
import { wire } from 'lwc';
import { getFoo } from 'foo-wire-adapter';

@wire
class Foo {}

class Foo {
    @wire
    handleFooChange(value) {}
}

class Foo {
    @wire('getFoo');
    handleFooChange(value) {}
}

const wireConfig = { foo: 'bar' };
class Foo {
    @wire(getFoo, wireConfig)
    handleFooChange(value) {}
}
```

Example of **correct** code:

```js
import { wire } from 'lwc';
import { getFoo } from 'foo-wire-adapter';

class Foo {
    @wire(getFoo)
    foo;

    @wire(getFoo)
    handleFooChange(value) {}

    @wire(getFoo, { foo: 'bar' })
    handleFooChange(value) {}
}
```
