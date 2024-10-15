# Avoiding host element mutation in connected callback

To ensure proper hydration during server-side rendering, it's essential to avoid mutating the host element within the `connectedCallback` of LWC components. Mutations can lead to inconsistencies and unexpected behavior during the hydration process.

## Rule details

To avoid problems during hydration, do not mutate the host element in connectedCallback. This includes:

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
