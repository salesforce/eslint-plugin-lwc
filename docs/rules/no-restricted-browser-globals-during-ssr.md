# Disallow access to global browser APIs during SSR (`lwc/no-restricted-browser-globals-during-ssr`)

Browser APIs must not be accessed when SSR is being done. This rule prevents usage of browser APIs like `DOMParser`, `DocumentFragment` etc.
in `connectedCallback` (and in methods called from `conenctedCallback` or anywhere when SSR is being done).

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        const parser = new new DOMParser()();
    }
}
```

Examples of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        const parser = new new DOMParser()();
    }
}
```
