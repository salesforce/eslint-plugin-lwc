# Deprecation Notice for Salesforce Scoped Modules during Server-Side Rendering (SSR)

Static imports of user-specific scoped modules, such as `@salesforce/user/*`, are not supported in LWC components marked with `lightning__ServerRenderable` or `lightning__ServerRenderableWithHydration`.

## Rule details

The following Salesforce scoped modules are deprecated when using Server-Side Rendering (SSR):

-   `@salesforce/user/*`
-   `@salesforce/userPermission/*`
-   `@salesforce/customPermission/*`
-   `@salesforce/featureFlag/*`

To replace these deprecated modules, it is recommended to use a **data provider** to fetch the required information declaratively. Avoid using the dynamic import pattern as shown below, as it is considered an **anti-pattern**.

### Handling Deprecation in Components

If your component relies on one of these scoped modules, follow these best practices:

1. **On the Server (SSR)**:

    - Render a placeholder during SSR to avoid negatively impacting **[web vitals](https://web.dev/articles/vitals)**.

2. **On the Client (after Hydration)**:
    - **[Dynamically import](https://developer.salesforce.com/docs/platform/lwr/guide/lwr-portable-best-practices.html#dynamically-import-non-portable-modules)** the module after hydration to avoid SSR issues.

```html
<template>
    <template lwc:if="{userId}"><c-user-profile user-id="{userId}"></c-user-profile></template>
    <!-- Rendering a placeholder avoids layout shifts on the client when the user ID is loaded -->
    <template lwc:else><c-user-placeholder></c-user-placeholder></template>
</template>
```

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';

export default class UserProfile extends LightningElement {
    userId = Id;
}
```

Example of **correct** code:

```js
import { LightningElement } from 'lwc';

export default class UserProfile extends LightningElement {
    userId;

    async connectedCallback() {
        if (!import.meta.env.SSR) {
            // Only load user-specific scoped modules on the client
            // This logic requires hydration of the component
            this.userId = await import('@salesforce/user/Id');
        }
    }
}
```
