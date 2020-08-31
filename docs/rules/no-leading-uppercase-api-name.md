# Validate property syntax to ensure it doesn't start with an upper-case character (no-leading-uppercase-api-name)

It's a best practice to start a public property name with a lowercase character. If a public property name starts with an uppercase character, to reference it in a template you must use [a special syntax](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.js_props_names). Convert the leading uppercase character to lowercase and prefix it with a hyphen (`-`). For example, to reference the `Upper` public property in a template, use the `-upper` attribute.

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
