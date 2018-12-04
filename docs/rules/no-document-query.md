# Disallow DOM query at the document level (no-document-query)

Querying the DOM at the document level is unsafe in LWC because it returns all matching nodes. LWC doesn't use native Shadow DOM, it overrides selector methods. Because of the performance implications, LWC can't globally override query methods

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
