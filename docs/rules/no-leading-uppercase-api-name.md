# Validate property syntax to ensure it doesn't start with an upper-case character (no-leading-uppercase-api-name)

It is a good practice in LWC to expose public properties with a lower case character. Public properties starting with an uppercase character can be only referenced in the template using [a special syntax](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.js_props_names). The leading uppercase has to be converted to lowercase and prefixed with an hyphen (`-`). For example, the `Upper` public property can be referenced via the `-upper` attribute in the template.

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
