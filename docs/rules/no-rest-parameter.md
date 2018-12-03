# Disallow usage of the rest parameter syntax (no-rest-parameter)

The [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) syntax was introduced in ECMAScript 2015. Since this syntax is invalid on older browsers, it needs to get transpiled down to ES5. The generated code loops over the `arguments` to create a new array object, which can slow down performance. Instead, copy `arguments` using `Array.prototype.slice.`

## Rule details

Example of **incorrect** code:

```js
function foo(...args) {
    console.log(args);
}
```

Example of **correct** code:

```js
const ArraySlice = Array.prototype.slice;

function foo() {
    const args = ArraySlice.call(arguments, 0);
    console.log(args);
}
```
