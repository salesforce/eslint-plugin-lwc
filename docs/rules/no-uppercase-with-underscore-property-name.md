# Validate property syntax to ensure it doesn't contain both underscore and upper-case characters (no-uppercase-with-underscore-property-name)

We [prohibit](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.js_props_names) attribute names that contain a combination of uppercase and underscore characters.

## Rule details

Example of **incorrect** code:

```js
import { api } from 'lwc';

class Foo {
    @api
    bar_Foo = true;

    @api
    _barFoo = true;
}
```

Example of **correct** code:

```js
import { api } from 'lwc';

class Foo {
    /* ok... */
    @api
    bar_foo = true;

    /* camelCase is best when defining property names */
    @api
    barFoo = true;
}
```
