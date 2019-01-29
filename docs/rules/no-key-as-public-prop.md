# Validate that `key` property cannot be decorated with @api (valid-api)

The `key` property is special to LWC and is used internally during component lifecycle. As a result, when `key` is used as a public property, its value is never passed down from parent to a child which results in incorrect behavior. Refrain from decorating `key` with @api.

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
