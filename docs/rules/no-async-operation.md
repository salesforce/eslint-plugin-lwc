# Restrict usage of async operations (no-async-operation)

Asynchronous operations make it difficult to track page performance. In most cases, you can use a lifecycle hook instead.

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
