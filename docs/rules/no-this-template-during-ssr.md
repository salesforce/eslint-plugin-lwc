# Disallow access of this.template during SSR (`lwc/no-this-template-during-ssr`)

Browser APIs must not be accessed when SSR is being done. This rule prevents usage of browser APIs like `querySelector`
on `template` in `connectedCallback` (and in methods called from `conenctedCallback` or anywhere when SSR is being done).

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

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
        this.template.querySelector('span')?.foo();
    }
}
```
