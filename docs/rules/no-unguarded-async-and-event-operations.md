## Disallow Unguarded Async Operations and Event Listeners during SSR (no-unguarded-async-and-event)

Unguarded async operations and event listeners can lead to unexpected behaviors in Server-Side Rendering (SSR) environments. To ensure that code runs safely and correctly, it is crucial to guard async operations and event listeners with an environment check.

### Rule Details

This rule disallows the use of unguarded async operations (such as fetch calls and async functions) and unguarded event listeners (such as addEventListener). It requires that these constructs be wrapped in an SSR check to determine whether the code is running in a browser environment.

#### Examples of Incorrect Code

Here are examples of code that violate the no-unguarded-async-and-event rule:

```js
// Incorrect: Unguarded fetch call
async function fetchData() {
    const response = await fetch('/api/data'); // Should be flagged
    console.log(response);
}

// Incorrect: Unguarded event listener
window.addEventListener('click', () => {
    console.log('Clicked'); // Should be flagged
});
```

#### Examples of Correct Code

Here are examples of how to properly guard async operations and event listeners:

```js
// Correct: Fetch call guarded by environment check
async function fetchData() {
    if (typeof window !== 'undefined') {
        const response = await fetch('/api/data');
        console.log(response);
    }
}

// Correct: Event listener guarded by environment check
if (typeof window !== 'undefined') {
    window.addEventListener('click', () => {
        console.log('Clicked');
    });
}
```

### Rule Options

The `no-unguarded-async-and-event` rule can be customized using options to specify additional async operations and event operations that should be monitored for unguarded usage.

#### Options Structure

The rule accepts a single object as its first argument, which can contain the following properties:

-   `additional-async-operations`: An array of strings representing additional async operations that should be checked for \* \* unguarded usage. If you want to include custom async methods that are not part of the default set (e.g., methods specific to your application), you can specify them here.

-   `additional-event-operations`: An array of strings representing additional event operations to be checked for unguarded usage. Similar to the async operations, this allows you to include custom event handling methods specific to your application.

### When Not To Use This Rule

If your project is strictly running in a browser environment and does not use SSR, you may choose to disable this rule.

### Recommended Configuration

It is recommended to enable this rule to ensure that async operations and event listeners are safely handled, especially in environments that may not support them.

```json
{
    "rules": {
        "no-unguarded-async-and-event": [
            "error",
            {
                "additional-async-operations": ["myCustomAsyncFunction"],
                "additional-event-operations": ["myCustomEventListener"]
            }
        ]
    }
}
```
