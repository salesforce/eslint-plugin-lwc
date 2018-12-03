# Restrict usage of `innerHTML` (no-inner-html)

Using of innerHTML poses a potential security concern and may allow malicious
javascript to unintentionally execute. Instead, use
`Node.textContent` to set plain text. To interact with DOM nodes, use the native DOM APIs.

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
