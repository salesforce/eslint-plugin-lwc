# Disallow access of properties on this during SSR (`lwc/no-this-property-during-ssr`)

Browser APIs must not be accessed when SSR is being done. This rule prevents usage of browser APIs like `querySelector`, `template`
on `this` in `connectedCallback` (and in methods called from `connectedCallback` or anywhere when SSR is being done).

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        this.querySelector('span')?.foo();
    }
}

export default class Foo extends LightningElement {
    connectedCallback() {
        this.template.querySelector('span')?.foo();
    }
}
```

Examples of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        this.querySelector('span')?.foo();
    }
}

export default class Foo extends LightningElement {
    renderedCallback() {
        this.template.querySelector('span')?.foo();
    }
}

export default class Bar extends LightningElement {
    renderedCallback() {
        this.refs.foo.foo();
    }
}
```
