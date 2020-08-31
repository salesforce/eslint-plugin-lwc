# Disallow `window.top` use (no-window-top)

The value of `window.top` in Lightning Locker vNext is `null`. To prevent code from breaking, assume that sandboxed code is executing in the topmost window.

The following `window.top` references are prohibited or fixable to `window`:

-   `top`
-   `document.defaultView.top`
-   `frames.top`
-   `globalThis.top`
-   `self.top`
-   `window.top`

## Rule details

Example of **incorrect** code:

```js
window.top;
```

Example of **correct** code:

```js
window;
```
