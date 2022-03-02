## Prevent importing restricted APIs from the "lwc" package (no-disallowed-lwc-imports)

Restricts importing disallowed modules from the `lwc` package. It's recommended to only use the "safe" APIs allowed by this rule.

This rule also disallows default imports as well as bare imports and exports – only importing explicitly named modules is allowed.

### Rule details

Examples of **incorrect** code:

```js
import { SecretApiYouShouldNotUse } from 'lwc';
```

```js
import * as lwc from 'lwc';
```

```js
import lwc from 'lwc';
```

```js
import 'lwc';
```

```js
export * from 'lwc';
```

Examples of **correct** code:

```js
import { LightningElement } from 'lwc';
```

```js
import { LightningElement, wire, api } from 'lwc';
```

If you disable this rule, then you may import unstable or otherwise undesirable APIs from `lwc`.
