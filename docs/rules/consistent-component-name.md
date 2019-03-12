# Ensure component class name match file name (consistent-component-name)

Ensures that the Lightning component class name match its file name. Having the component name in sync with the file name offers better stack traces and debuggability.

## Rule details

Example of **incorrect** code:

```js
// foo.js
export default class extends LightningElement {}

// foo.js
export default class Bar extends LightningElement {}
```

Example of **correct** code:

```js
// foo.js
export default class Foo extends LightningElement {}

// complexName.js
export default class ComplexName extends LightningElement {}
```
