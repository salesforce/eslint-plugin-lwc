# Disallow use of the async-await syntax (no-async-await)

The [async-await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax was introduced in ES8. In old browsers, this syntax is transpiled down to ES5, which can cause performance issues if the code is executed many times. To ensure that code performs well even in old browsers, use a standard promise chain instead.


## Rule details

Example of **incorrect** code:

```js
async function fetchJSON(url) {
    const res = await fetch(url);
    return res.json();
}
```

Example of **correct** code:

```js
function fetchJSON(url) {
    return fetch(url).then(res => res.json());
}
```
