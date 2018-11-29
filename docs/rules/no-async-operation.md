# Restrict usage of async operations (no-async-operation)

In most of the cases, asynchronous operations are not necessary. The usage of asynchronous operations are often misused and exhibit most of the time a misunderstanding of the component life-cycle. On top of this async operations makes it harder to track page performance.

## Rule details

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        setTimeout(() => {
            const el = this.template.querySelector('span');
            // ... manipulating the span LightningElement
        });
    }
}
```

Example of **correct** code:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        const el = this.template.querySelector('span');
        // ... manipulating the span LightningElement
    }
}
```
