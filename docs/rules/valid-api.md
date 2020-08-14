# Validate `@api` decorator usage (valid-api)

The following restrictions apply to the `@api` decorator:

-   Apply to class fields and class methods only.
-   Fields and methods should be unique per class.
-   Fields and methods can't start with `on`. The `on` prefix is reserved to bind event handlers.
-   Fields and methods can't start with `data`, `slot` or `part`. These names are reserved by LWC.
-   Boolean properties must be initialized with `false`. By initializing a public property to `true`, the consumer component can't set its value to `false` via the template.

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
