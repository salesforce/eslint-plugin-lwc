# Disallow usage of the async-await syntax (no-async-await)

The [async-await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax has been introduced with ECMAScript 2017. Since this syntax is invalid on older browsers, it needs to get transpiled down to ES5. Async-await gives the illusion of synchronicity while manipulating asynchronous primitives. It's ES5 representation based on a complex state machine. This has been proven to be a performance bottleneck if the method is part of the critical path and is invoked enough times.

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
