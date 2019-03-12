# Disallow duplicate class members (no-dupe-class-members)

If there are declarations of the same name in class members, the last declaration overwrites other declarations silently. It can cause unexpected behaviors. This rule prevents usage of duplicate class members (fields and methods) on the same class.

> Note: This rule extends the original eslint rule [`no-dupe-class-members`](https://eslint.org/docs/rules/no-dupe-class-members) to add support for [class fields](https://github.com/tc39/proposal-class-fields) that are not yet stage 4.

## Rule details

Example of **incorrect** code:

```js
class Foo {
    bar() {}
    bar() {}
}

class Foo {
    bar;
    bar() {}
}

class Foo {
    bar;
    get bar() {}
}
```

Example of **correct** code:

```js
class Foo {
    foo() {}
    bar() {}
}

class Foo {
    foo;
    bar() {}
}

class Foo {
    foo;
    get bar() {}
}
```
