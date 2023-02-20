# Disallow access to global browser APIs during SSR (`lwc/no-restricted-browser-globals-during-ssr`)

Browser APIs must not be accessed when SSR is being done. This rule prevents usage of browser APIs like `DOMParser`, `DocumentFragment` etc.
in `connectedCallback` (and in methods called from `connectedCallback` or anywhere when SSR is being done).

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        const parser = new DOMParser();
    }
}
```

Examples of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        const parser = new DOMParser();
    }
}
```

## Options

The rule takes one option, an object, which has one key `restricted-globals` which is an object. The keys in the object
are strings which represent the name of the global and the values can be booleans, `true` indicating that the global
is restricted and `false` to indicate that the global is allowed (useful for overriding an already restricted global).

```js
{ "restricted-globals": { MyBrowserOnlyGlobal: false, MyRestrictedGlobal: true } }
```
