# Validate that `key` property cannot be decorated with @api (valid-api)

This rule checks whether `api` is applied to `key` property.

## Rule details

Example of **incorrect** code:

```js
import { api } from 'lwc';

class Foo {
    @api
    key;
}

class Foo {
    @api
    key = "";
}

class Foo {
    @api
    key = 1;
}

class Foo {
    @api
    key = {};
}

class Foo {
    @api
    get key() {}
}

class Foo {
    @api
    get key() {}
    set key() {}
}
```
