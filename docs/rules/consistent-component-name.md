# Ensure component class name matches file name (consistent-component-name)

Having the component name in sync with the file name offers better stack traces and debuggability.

> Note: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

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
