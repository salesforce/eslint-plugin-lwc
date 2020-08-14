# Disallow document.location (no-document-location)

The value of `document.location` in Lightning Locker vNext is `null`. To prevent code from breaking, use `window.location`.

Replace these references with `window.location`:

-   `document.location`
-   `window.document.location`

## Rule details

Example of **incorrect** code:

```js
document.location;
```

Example of **correct** code:

```js
window.location;
```
