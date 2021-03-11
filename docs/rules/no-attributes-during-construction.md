# Disallow attributes during construction (no-attributes-during-construction)

The `LightningElement` base class extended by LWC component classes defines several properties that, when set,
causes its custom element to gain attributes. By
[specification](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance), custom element
constructors must not cause the custom element to gain attributes.

This rule prevents set operations in the constructor method that violate this restriction. It only knows about
`LightningElement` properties that implement this behavior. It will not detect custom properties that set attributes
during construction time.

A few examples of such properties are `hidden`, `id`, `role`, `tabIndex`, and `title`.

## Rule details

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    constructor() {
        this.title = 'this causes the element to gain the title attribute during construction';
    }
}
```

Examples of **correct** code:

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    connectedCallback() {
        this.title = 'this causes the element to gain the title attribute upon connection';
    }
}
```

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    title = 'this custom property overrides the one in LightningElement';

    constructor() {
        this.title =
            'this does not cause the element to gain the title attribute during construction';
    }
}
```
