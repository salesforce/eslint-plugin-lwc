# Disallow usage of deprecated LWC APIs (no-deprecated)

The following LWC lifecycle hooks have been deprecated and removed:

-   `attributeChangedCallback`
-   `observeAttribute`

## Rule details

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';

class Foo extends LightningElement {
    static observedAttributes = ['title'];
}

class Bar extends LightningElement {
    static get observedAttributes() {
        return ['title'];
    }
}

class Baz extends LightningElement {
    attributeChangedCallback(name, prevValue, nextValue) {
        if (name === 'title') {
            // ...
        }
    }
}
```
