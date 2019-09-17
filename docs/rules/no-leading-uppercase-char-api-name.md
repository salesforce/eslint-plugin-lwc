# Validate property syntax to ensure it doesn't start with an upper-case character (no-leading-uppercase-char-api-name)

This rule ensures that a public property doesn't start with an upper-case character.

## Rule details

Example of **incorrect** code:

```js
import { api } from 'lwc';

class Foo {
    @api
    Foo = true;
}

class Foo {
    @api
    Foo() {}
}

class Foo {
    @api
    get Foo() {
        return this._foo;
    }
    set Foo(value) {
        this._foo = value;
    }
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
