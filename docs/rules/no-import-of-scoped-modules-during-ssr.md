# Disallow static import of scoped modules during SSR (`lwc/no-import-of-scoped-modules-during-ssr`)

During server-side rendering (SSR), these modules resolve to static values on the server and are updated to actual values on the client.

## Rule details

**Static imports of user-scoped modules:**

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';
import userId from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';

export default class Foo extends LightningElement {
    // This component should not import user-scoped modules during SSR
}
```

Example of **correct** code:

**Dynamic imports of user-scoped modules:**

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';

export default class Foo extends LightningElement {
    connectedCallback() {
        import('@salesforce/userPermission').then((module) => {
           ...
        });
    }
}
```

Example of **correct** code:

**Imports of formFactor-scoped module:**

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';
import formFactor from '@salesforce/client/formFactor';

export default class Foo extends LightningElement {
   ...
}
```

Example of **correct** code:

Render all form factor outputs and show/hide with media queries https://jsbin.com/gasuyidixa/edit?html,css,output.

**Imports of featureFlag-scoped module:**

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';
import { isFeatureEnabled } from '@salesforce/featureFlag';

export default class Foo extends LightningElement {
   ...
}
```

Example of **correct** code:
...
