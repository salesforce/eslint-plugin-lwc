# Disallow DOM query at the document level (no-document-query)

When running with synthetic shadow, it isn't safe to query the DOM at the document level. Document-level APIs don't follow shadow DOM semantics and allow access to elements that shouldn't be accessible. To future-proof your component, avoid using these APIs and instead use `this.querySelector` and `this.template.querySelector`.

The following methods are restricted by this rule:

-   `document.querySelector`
-   `document.querySelectorAll`
-   `document.getElementsByTagName`
-   `document.getElementsByTagNameNS`
-   `document.getElementsByClassName`
-   `document.getElementById`

## Rule details

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';

export default class MyList extends LightningElement {
    renderedCallback() {
        const item = document.querySelector('.my-item');
    }
}
```

Example of **correct** code:

```js
import { LightningElement } from 'lwc';

export default class MyList extends LightningElement {
    renderedCallback() {
        const item = this.template.querySelector('.my-item');
    }
}
```
