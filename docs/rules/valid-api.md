# Validate `@api` decorator usage (valid-api)

The following restrictions apply to the `@api` decorator:

-   Apply to class fields and class methods only.
-   Fields and methods should be unique per class.
-   Fields and methods can't start with `on`. The `on` prefix is reserved to bind event handlers.
-   Fields and methods can't be named `slot`, `part` or `dataset`. These names are reserved by LWC.
-   Fields and methods can't start with `data[A-Z]`. These are mapped to the reflected property `this.dataset.*`.
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

## Options

```json
{
    "type": "object",
    "properties": {
        "disallowUnderscoreUppercaseMix": {
            "type": "boolean"
        }
    },
    "additionalProperties": false
}
```

### `disallowUnderscoreUppercaseMix`

This property controls whether the rule allows the name of a public property or method to contain both uppercase and underscore characters. Mixing uppercase and underscore characters in public properties isn't recommended, because those properties can't be referenced from the template.

By default, this property is set to `false`.

Example of **incorrect** code:

```js
/* eslint lwc/valid-api: ["error", { "disallowUnderscoreUppercaseMix": true }] */
import { api } from 'lwc';

class Foo {
    @api
    Foo_;

    @api
    fO_o;
}
```
