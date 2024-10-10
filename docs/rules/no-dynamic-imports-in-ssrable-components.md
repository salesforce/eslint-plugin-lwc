# Disallow dynamic import in SSR-able components (`lwc/no-dynamic-imports-in-ssrable-components`)

Dynamic imports are not processed on the server and do not affect server-side rendered output.

## Rule details

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        import('@salesforce/user/isGuest').then((module) => {
           ...
        });
    }
}
```
