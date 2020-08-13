# Validate `api` decorator usage (valid-api)

This rule checks whether every `api` decorator is valid.

-   The `api` decorator can only be applied to class fields and class methods.
-   Public properties and method should be unique.
-   Public properties and methods can't start with `on`. The `on` prefix is reserved to bind event handlers.
-   Public properties and methods can't with `data`, `slot` and `part`. The `data` prefix is reserved by LWC.
-   Public properties and methods can't be named `slot` or `part`. Those names are reserved by LWC.
-   Boolean public property should only be initialized with `false`. By initializing a public property to `true`, the consumer component can't set its value to `false` via the template.

## Rule details

Example of **incorrect** code:

```js
import { api } from 'lwc';

class Foo {
    @api
    foo = true;
}

class Foo {
    @api
    onChange() {}
}

class Foo {
    @api
    foo;
    @api
    foo() {}
}

class Foo {
    @api
    foo = 1;
    @api
    foo = 2;
}
```

Example of **correct** code:

```js
import { api } from 'lwc';

class Foo {
    @api
    foo;
}

class Foo {
    _foo;

    @api
    get foo() {
        return this._foo;
    }
    set foo(value) {
        this._foo = value;
    }
}

class Foo {
    @api
    foo() {}
}
```
