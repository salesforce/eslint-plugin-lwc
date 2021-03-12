# Disallow setting attributes during construction (no-attributes-during-construction)

The `LightningElement` base class extended by LWC component classes defines several properties that, when set,
renders attributes on its custom element. This behavior mimics the native browser behavior.

By [specification](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance), custom
element constructors must not cause the custom element to gain attributes. This rule prevents set operations in the
constructor method that violate this restriction.

## Caveats

This rule only knows about `LightningElement` properties that implement this behavior (e.g., `hidden`, `id`, `role`,
`tabIndex`, `title`, etc) and will not detect custom implementations that may set attributes during construction time:

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    set foo(val) {
        this.setAttribute('foo', val);
    }

    constructor() {
        this.foo = 'this causes the element to gain the foo attribute during construction';
    }
}
```

This rule will not detect violations on component classes that do not directly inherit from `LightningElement`:

```js
import { LightningElement } from 'lwc';

class Base extends LightningElement {}

export default class Test extends Base {
    constructor() {
        this.title = 'this causes the element to gain the foo attribute during construction';
    }
}
```

## Examples

### Invalid

The following example is setting the `title` property which the `LightningElement` base class provides by default and
this renders the `title` attribute on the host element.

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    constructor() {
        this.title = 'this causes the element to gain the title attribute during construction';
    }
}
```

### Valid

The following example does not set the value of `title` inside the constructor.

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    connectedCallback() {
        this.title = 'this causes the element to gain the title attribute upon connection';
    }
}
```

The following example overrides the `title` property which the `LightningElement` base class provides by default, with a
`title` property that, when set, does not render an attribute on the host element.

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
