# Disallow references to document during SSR (`lwc/no-document-during-ssr`)

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Browser APIs must not be accessed when SSR is being done. This rule prevents usage of `document` in `connectedCallback`
(and in methods called from `conenctedCallback` or anywhere when SSR is being done).

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        document.foo = true;
    }
}
```

Examples of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        document.foo = true;
    }
}
```
