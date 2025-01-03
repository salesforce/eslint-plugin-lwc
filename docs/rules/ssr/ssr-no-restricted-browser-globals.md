# Disallow access to global browser APIs during SSR (`lwc/ssr-no-restricted-browser-globals`)

Browser APIs must not be accessed when SSR is being done. This rule prevents usage of browser APIs like `DOMParser`, `DocumentFragment` etc.
in `connectedCallback` (and in methods called from `connectedCallback` or anywhere when SSR is being done).

All browser globals, that are not available in Node, are not allowed.

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        const parser = new DOMParser();
    }
}
```

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    constructor() {
        this.handleResize = this.handleResize.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    connectedCallback() {
        globalThis.addEventListener('resize', this.handleResize);
        document.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        globalThis.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.handleClick);
    }

    handleResize(event) {
        /* ... */
    }

    handleClick(event) {
        /* ... */
    }
}
```

Examples of **correct** code for this rule:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        if (!import.meta.env.SSR) {
            const parser = new DOMParser();
        }
    }
}
```

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    constructor() {
        this.handleResize = this.handleResize.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    connectedCallback() {
        globalThis.addEventListener?.('resize', this.handleResize);
        globalThis.document?.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        globalThis.removeEventListener?.('resize', this.handleResize);
        globalThis.document?.removeEventListener('click', this.handleClick);
    }

    handleResize(event) {
        /* ... */
    }

    handleClick(event) {
        /* ... */
    }
}
```

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    renderedCallback() {
        const parser = new DOMParser();
    }
}
```

## Options

The rule takes one option, an object, which has one key `restricted-globals` which is an object. The keys in the object
are strings which represent the name of the global and the values can be booleans, `true` indicating that the global
is restricted and `false` to indicate that the global is allowed (useful for overriding an already restricted global).

```json
{ "restricted-globals": { "MyBrowserOnlyGlobal": true, "MyAvailableGlobal": false } }
```
