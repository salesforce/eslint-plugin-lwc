# Disallow document.location (no-document-location)

The value of `document.location` in Lightning Locker vNext is `null`. To prevent code from breaking `window.location` should be used.

The following `document.location` references are prohibited or fixable to `window.location`:

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
