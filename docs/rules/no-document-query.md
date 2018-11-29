# Disallow DOM query at the document level (no-document-query)

Querying the DOM at the `document` level is unsafe in the context of LWC. When the native Shadow DOM is not enabled, querying the DOM from the `document` level will return all the matching nodes. LWC overrides selector methods to return a subset of the node depending on a target Shadow DOM. Because of the performance implications, LWC can't patch globally query methods, therefor developer need to be extremely cautious when querying the DOM outside LWC.

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
