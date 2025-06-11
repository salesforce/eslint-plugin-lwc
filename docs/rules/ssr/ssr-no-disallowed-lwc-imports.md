# Prevent importing restricted APIs from the "lwc" package in SSR-able components (`@lwc/lwc/ssr-no-disallowed-lwc-imports`)

Restricts importing specific modules from the `lwc` package in components that may be server-side rendered (`lightning__ServerRenderable` or `lightning__ServerRenderableWithHydration`). Certain LWC APIs may not be compatible with server-side rendering and should be avoided in SSR-able components.

This rule is complementary to the general `no-disallowed-lwc-imports` rule and only flags LWC APIs that are otherwise valid but not supported in SSR contexts.

## Rule details

This rule prevents imports of LWC APIs that are not supported or recommended in server-side rendering contexts. By default, it disallows:

-   `readonly` - Not supported in SSR environment

Examples of **incorrect** code:

```js
import { readonly } from 'lwc';

export default class MyComponent extends LightningElement {
    @api value = readonly({ name: 'test' });
}
```

```js
import { LightningElement, readonly } from 'lwc';

export default class MyComponent extends LightningElement {
    data = readonly({ items: [] });
}
```

Examples of **correct** code:

```js
import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
    @api value = { name: 'test' };
}
```

```js
import { LightningElement, api, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @api data;
    @track items = [];
}
```

```js
// Re-exporting is allowed since the component doesn't use the API itself
export { readonly } from 'lwc';

export default class MyUtilityComponent extends LightningElement {
    // This component is SSR-compatible
}
```

## Configuration

### `disallowlist`

The `disallowlist` property allows you to specify which LWC APIs should be disallowed in SSR context. It accepts an array of strings and overrides the default list.

Examples of **incorrect** code with custom disallowlist:

```js
/* eslint @lwc/lwc/ssr-no-disallowed-lwc-imports: ["error", { "disallowlist": ["readonly", "track"] }] */
import { track } from 'lwc';
```

```js
/* eslint @lwc/lwc/ssr-no-disallowed-lwc-imports: ["error", { "disallowlist": ["readonly", "track"] }] */
import { readonly } from 'lwc';
```

Examples of **correct** code with custom disallowlist:

```js
/* eslint @lwc/lwc/ssr-no-disallowed-lwc-imports: ["error", { "disallowlist": ["readonly", "track"] }] */
import { LightningElement, api } from 'lwc';
```

## When Not To Use It

If your components are never server-side rendered or if you need to use specific LWC APIs that are flagged by this rule, you may want to disable it. However, be aware that using unsupported APIs in SSR contexts may cause runtime errors or unexpected behavior during server-side rendering.

## Relationship to Other Rules

This rule works alongside the general `lwc/no-disallowed-lwc-imports` rule:

-   **`no-disallowed-lwc-imports`**: Handles general import/export validation (bare imports, namespace imports, default imports, etc.)
-   **`ssr-no-disallowed-lwc-imports`**: Focuses only on SSR-specific import restrictions for otherwise valid imports

Both rules should typically be used together in SSR-able components.
