# Using @salesforce/client/formFactor in SSR-able components is not the best practice(`lwc/ssr-no-form-factor`)

## Rule details

The [`@salesforce/client/formFactor`](https://developer.salesforce.com/docs/platform/lwc/guide/create-client-form-factor.html) module defaults to a value of `"Large"` during SSR, regardless of the device that made the request. This can cause issues where the UI shifts once client-side rendering is complete, particularly when rendering on smaller devices. To avoid this, use **[CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)** to handle form factors and **[responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)** for different screen sizes.

Example of **incorrect** code:

```js
import FORM_FACTOR from '@salesforce/client/formFactor';
export default class Sample extends LightningElement {
    classes = '';
    connectedCallback() {
        this.classes = FORM_FACTOR === 'small' ? 'mobile' : '';
    }
}
```

```html
<template>
    <div class="{classes}">
        <div class="col-3"><!-- ... --></div>
        <div class="col-6"><!-- ... --></div>
        <div class="col-3"><!-- ... --></div>
    </div>
</template>
```

```css
.col-3 {
    width: 25%;
}
.col-6 {
    width: 50%;
}
.mobile .col-3 {
    width: 100%;
}
.mobile .col-6 {
    width: 100%;
}
```

Example of **correct** code:

```js
export default class Sample extends LightningElement {}
```

```html
<template>
    <div>
        <div class="col-3"><!-- ... --></div>
        <div class="col-6"><!-- ... --></div>
        <div class="col-3"><!-- ... --></div>
    </div>
</template>
```

```css
.col-3 {
    width: 25%;
}
.col-6 {
    width: 50%;
}

/* mobile */
@media (max-width: 768px) {
    [class*='col-'] {
        width: 100%;
    }
}
```
