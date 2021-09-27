## Prevent accessing the immediate children of this.template (no-template-children)

Directly accessing the shadow root children elements via `this.template` can produce inconsistent results across browsers and across native and synthetic shadow DOM. This rule prevents accessing these unsafe properties.

### Rule details

Let's assume a `Test` component with the following template:

```html
<template>
    <div>Find me</div>
</template>
```

The `Test` component will have to get a reference to the `<div>` element rendered in its shadow tree.

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    renderedCallback() {
        const element = this.template.firstChild;
        //                            ^ Accessing firstChild on this.template is unsafe.
    }
}
```

In the code above, accessing `firstChild` on `this.template` could return the following results:

-   A `<style>` element in the case of native shadow DOM running on [browsers that do not support constructable stylesheets](https://caniuse.com/mdn-api_shadowroot_adoptedstylesheets).
-   The`<div>` element defined in the component's template, if this is synthetic shadow DOM, or this is native shadow DOM and the browser supports constructable stylesheets.

So the behavior could be different in different browsers, or in native shadow DOM compared to synthetic shadow DOM.

The following properties are considered unsafe to access on `this.template`:

-   `children`
-   `childNodes`
-   `firstChild`
-   `firstElementChild`
-   `lastChild`
-   `lastElementChild`

Example of **correct** code:

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    renderedCallback() {
        const element = this.template.querySelector('div'); // Use querySelector instead of firstChild.
    }
}
```

In the example above, we are using `querySelector` to find the element from our template – in this case, a `<div>`. The behavior will not differ between browsers, because the selector will not match any element that isn't a `<div>` element, and this is regardless of whether the component is running in native shadow DOM or not.

In your own components, use whichever selector makes sense for the element you're trying to find.
