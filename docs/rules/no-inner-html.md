# Restrict usage of `innerHTML` (no-inner-html)

Usage of innerHTML poses a potential security concern and may allow malicious
javascript to unintentionally execute. If setting plain text, use
`Node.textContent`. If interacting with DOM nodes, use the native DOM APIs.

## Rule details

Disallow the use of 'innerHTML' in all its forms. This includes `innerHTML`,
`outputHTML`, and `insertAdjacentHTML`.

Example of **incorrect** code:

```js
element.innerHTML = '<foo></foo>';
element.outerHTML = '<foo></foo>';
element.insertAdjacentHTML = '<foo></foo>';
```

Example of **correct** code:

```js
element.textContent = 'foo';
```
