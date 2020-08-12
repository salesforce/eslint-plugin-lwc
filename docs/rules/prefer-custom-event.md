# Suggest usage of `CustomEvent` over `Event` constructor (prefer-custom-event)

`CustomEvent` is a standard `Event` that can also carry any data. The main added benefit of creating an event using the `CustomEvent` constructor over `Event` is that the `detail` property carrying the data is readonly.

```js
const evt1 = new CustomEvent('test', { detail: 'original' });
evt1.detail = 'updated'; // (throws an error in strict mode)
console.log(evt1.detail); // original

const evt2 = new Event('test');
evt2.detail = 'original';
evt2.detail = 'updated';
console.log(evt2.detail); // updated
```

## Rule details

Example of **incorrect** code:

```js
const evt = new Event('test');
```

Example of **correct** code:

```js
const evt = new CustomEvent('test');
```
