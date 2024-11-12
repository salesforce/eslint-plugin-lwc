# Disallow use of `process.env.NODE_ENV` during SSR (`lwc/no-node-env-in-ssr`)

Using `process.env.NODE_ENV` during server-side rendering in JavaScript is not recommended because it can introduce unexpected behavior and bugs in your application. This environment variable is typically used for conditional logic related to development or production builds, which is more relevant on the client side.

## Rule Details

Example of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Foo:connectedCallback');
        }
    }
}
```

Examples of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        if (!import.meta.env.SSR && process.env.NODE_ENV !== 'production') {
            console.log('Foo:connectedCallback');
        }
    }
}
```
