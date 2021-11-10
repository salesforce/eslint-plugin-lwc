# Disallow duplicate class members (no-dupe-class-members)

> ⚠️ This rule is deprecated. It can be replaced by ESLint builtin [no-dupe-class-members](https://eslint.org/docs/rules/no-dupe-class-members) rule. ⚠️

If there are declarations of the same name in class members, the last declaration overwrites other declarations silently. This can cause unexpected behaviors. This rule prevents usage of duplicate class members (fields and methods) on the same class.

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
