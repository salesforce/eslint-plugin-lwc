# Validate `wire` decorator usage (valid-wire)

This rule checks whether every `wire` decorator is valid.

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
