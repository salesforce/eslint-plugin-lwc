# Disallow usage of the for-of syntax (no-for-of)

The [for-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) syntax was introduced in ES6. On older browsers, this syntax is transpiled down to ES5. Since [for-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) is based upon the iterable protocol, the generated code is bloated and nonperformant. If your app supports older browsers, use a standard `for` instead.

## Rule details

Example of **incorrect** code:

```js
const arr = [1, 2, 3];

for (let item of arr) {
    console.log(item);
}
```

Example of **correct** code:

```js
const arr = [1, 2, 3];

for (let i = 0; i < arr.length; i++) {
    console.log(i);
}
```
