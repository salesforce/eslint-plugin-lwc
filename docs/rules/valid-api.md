# Validate `api` decorator usage (valid-api)

This rule checks whether every `api` decorator is valid.

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
