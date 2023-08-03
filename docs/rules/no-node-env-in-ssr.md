# Disallow use of `process.env.NODE_ENV` during SSR (`lwc/no-node-env-in-ssr`)

TODO

## Rule Details

Example of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        // TODO
    }
}
```

Example of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        // TODO
    }
}
```
