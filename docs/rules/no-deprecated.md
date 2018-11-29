# Disallow usage of deprecated LWC APIs (no-deprecated)

Several methods and lifecycle hooks have been deprecated between versions of LWC. This rule will warn you if you try to use a deprecated method.

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
