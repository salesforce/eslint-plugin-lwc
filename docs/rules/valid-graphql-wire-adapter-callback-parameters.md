# Validate graphql wire adapter callback parameter usage (valid-graphql-wire-adapter-callback-parameters)

The graphql @wire adapter returns `{ data, errors }` instead of `{ data, error }`. Validate that graphql @wire customers are using `errors` not `error`.

## Rule details

Example of **incorrect** code:

```js
import { wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

class Test {
    @wire(graphql, {})
    wiredMethod({ error, data }) {}
}
```

Example of **correct** code:

```js
import { wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

class Test {
    @wire(graphql, {})
    wiredMethod({ errors, data }) {}
}
```
