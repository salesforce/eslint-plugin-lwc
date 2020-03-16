## Prevent event listeners from leaking memory (no-leaky-event-listeners)

It is extremely easy to leak event listeners. In most of the cases the event handler leaks as well as all the objects captured in the closure. This rules prevents common patterns associated with event listener leaking.

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

In the code above the event listener will leak because invoking `Function.prototype.bind()` on a method returns a new method. Since the component doesn't have a reference to the newly created function, the added event listener can't be subsequently removed. Also, the `this` value is closured into the generated function so the component is kept in memory.

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

In the example above we were able to get rid of the `Function.prototype.bind()` by using a class field associated with an arrow function. The `this` value used in the arrow function body will always be the component instance.
