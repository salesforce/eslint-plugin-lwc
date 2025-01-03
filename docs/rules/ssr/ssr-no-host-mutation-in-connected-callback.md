# Avoiding host element mutation in connected callback

To ensure consistent behavior in Lightning Web Components (LWC), it is important to avoid mutating the host element within the `connectedCallback` method. Mutations can lead to unpredictable outcomes and inconsistencies in component behavior.

## Rule details

To prevent issues with component lifecycle consistency, avoid mutating the host element in `connectedCallback`. This includes:

-   `this.setAttribute`
-   `this.classList.add`

Example of **incorrect** code:

```html
<template>
    <x-child></x-child>
</template>
```

```js
import { LightningElement, api } from 'lwc';

export default class ExampleComponent extends LightningElement {
    @api condition;

    connectedCallback() {
        this.classList.add(`conditional-class-${this.condition}`);
        this.setAttribute('data-some-attribute', 'value');
    }
}
```

Example of **correct** code:

```html
<template>
    <div class="{theClassMyChildNeeds}">
        <x-child></x-child>
    </div>
</template>
```

```js
export default class Cmp extends LightningElement {
    @api fromOutside;
    get theClassMyChildNeeds() {
        return `my-child-needs-${this.fromOutside}`;
    }
}
```
