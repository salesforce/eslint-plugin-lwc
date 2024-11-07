# Disallow access of properties on this during SSR (`lwc/no-unsupported-properties`)

Browser APIs must not be accessed when SSR is being done. This rule prevents usage of browser APIs like `querySelector`,
`dispatchEvent`, on `this` in `connectedCallback` (and in methods called from `connectedCallback` or anywhere when
SSR is being done).

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        this.querySelector('span')?.getAttribute?.('role');
    }
}

export default class Foo extends LightningElement {
    connectedCallback() {
        this.dispatchEvent(new CustomEvent('customevent'));
    }
}
```

Examples of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        if (!import.meta.env.SSR) {
            this.querySelector('span')?.getAttribute('role');
        }
    }
}

export default class Foo extends LightningElement {
    connectedCallback() {
        if (!import.meta.env.SSR) {
            this.dispatchEvent(new CustomEvent('customevent'));
        }
    }
}
```

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        this.querySelector('span')?.foo();
    }
}

export default class Foo extends LightningElement {
    renderedCallback() {
        // **Caution:** This lifecycle hook is very likely
        // to be called more than once.
        this.dispatchEvent(new CustomEvent('customevent'));
    }
}
```
