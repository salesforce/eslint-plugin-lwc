## Prevent event listeners from leaking memory (no-leaky-event-listeners)

It is extremely easy to leak event listeners. In most of the cases, not only the event handler leaks, but also all the object capture into closure. This rules prevents common patterns associated with event listener leaking.

### Rule details

Example of **incorrect** code:

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    connectedCallback() {
        window.addEventListener('test', handleTest.bind(this));
        //                              ^ Event listener will leak.
    }

    disconnectedCallback() {
        window.removeEventListener('test', handleTest.bind(this));
        //                                 ^ Event listener will leak.
    }

    handleTest() {}
}
```

In the code above the event listener will leak because invoking `Function.prototype.bind()` on a method returns a new method with a bound `this` value. Since the component doesn't have a reference to the newly created function, the added event listener can't be removed later on. In this case, since the `this` value is trapped into the generated function, each newly created component will be kept in memory.

Example of **correct** code:

```js
import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
    connectedCallback() {
        window.addEventListener('test', this.handleTest);
    }

    disconnectedCallback() {
        window.removeEventListener('test', this.handleTest);
    }

    handleTest = () => {};
}
```

In the example above we were able to get rid of the `Function.prototype.bind()` by using a class field associated with an arrow function. The `this` value uses in the arrow function body will always be the component instance.
