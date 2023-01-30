# Disallow references to window during SSR (`lwc/no-window-during-ssr`)

Browser APIs must not be accessed when SSR is being done. This rule prevents usage of `window` in `connectedCallback`
(and in methods called from `conenctedCallback` or anywhere when SSR is being done).

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        window.foo = true;
    }
}
```

Examples of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        window.foo = true;
    }
}
```
