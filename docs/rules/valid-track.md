# Validate `track` decorator usage (valid-track)

This rule checks whether every `track` decorator is valid.

## Rule details

Example of **incorrect** code:

```js
import { track } from 'lwc';

@track
class Foo {}

class Foo {
    @track
    trackedMethod() {}
}

class Foo {
    @track
    set state(value) {}
}

class Foo {
    @track
    static state;
}
```

Example of **correct** code:

```js
import { track } from 'lwc';

class Foo {
    @track
    state;
}
```
