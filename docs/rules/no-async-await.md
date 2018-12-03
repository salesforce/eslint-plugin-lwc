# Disallow usage of the async-await syntax (no-async-await)

The [async-await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax was introduced in ECMAScript 2017. Since this syntax is invalid on older browsers, it needs to get transpiled down to ES5. Async-await gives the illusion of synchronicity while manipulating asynchronous primitives and can cause performance issues. Use a standard promise-chain instead.


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
