# Validate `track` decorator usage (valid-track)

The following restriction applies to `track` decorator:

-   The `track` decorator can only be applied to class fields.

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
