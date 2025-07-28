# @lwc/eslint-plugin-lwc

> Official ESLint rules for Lightning Web Components (LWC).

## Installation

```
$ npm install eslint @babel/core @babel/eslint-parser @lwc/eslint-plugin-lwc --save-dev
```

## Usage

_Starting with v3.0.0, @lwc/eslint-plugin-lwc only supports eslint@v9. Use @lwc/eslint-plugin-lwc@v1.x for older versions of eslint._

Import `@lwc/eslint-plugin-lwc` and use it in the `plugins` section of your configuration as shown below. Then configure the desired rules in the `rules` sections. Some of the syntax used in Lightning Web Components is not yet stage 4 (eg. class fields or decorators), and the out-of-the-box parser from ESLint doesn't support this syntax yet. In order to parse the LWC files properly, set the `parser` field to [`@babel/eslint-parser`](https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser) in the `languageOptions` section of the eslint config.

Example of `eslint.config.js`:

```js
const eslintPluginLwc = require('@lwc/eslint-plugin-lwc');
const babelParser = require('@babel/eslint-parser');

module.exports = [
    {
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    parserOpts: {
                        plugins: [
                            'classProperties',
                            ['decorators', { decoratorsBeforeExport: false }],
                        ],
                    },
                },
            },
        },
        plugins: {
            '@lwc/lwc': eslintPluginLwc, // https://github.com/salesforce/eslint-plugin-lwc
        },
        rules: {
            '@lwc/lwc/no-deprecated': 'error',
            '@lwc/lwc/valid-api': 'error',
            '@lwc/lwc/no-document-query': 'error',
            '@lwc/lwc/ssr-no-unsupported-properties': 'error',
        },
    },
];
```

### Usage with TypeScript

To enable working with TypeScript projects, install `@babel/preset-typescript` as a dependency add `"typescript"` to `languageOptions.parserOptions.babelOptions.parserOpts.plugins` in your `eslint.config.js`.

Example:

```js
const eslintPluginLwc = require('@lwc/eslint-plugin-lwc');
const babelParser = require('@babel/eslint-parser');

module.exports = [
    {
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    parserOpts: {
                        plugins: [
                            'classProperties',
                            ['decorators', { decoratorsBeforeExport: false }],
                            'typescript',
                        ],
                    },
                },
            },
        },
    },
];
```

For more details about configuration please refer to the dedicated section in the ESLint documentation: https://eslint.org/docs/user-guide/configuring

## Configurations

To choose from three configuration settings, install the [`eslint-config-lwc`](https://github.com/salesforce/eslint-config-lwc) sharable configuration package.

### Processors

| Processor ID                        | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| [lwc/ssr](./docs/processors/ssr.md) | Lint only JavaScript files of SSR-able components |

## Rules

### LWC

| Rule ID                                                                                                                                | Description                                                                    | Fixable |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------- |
| [lwc/consistent-component-name](./docs/rules/consistent-component-name.md)                                                             | ensure component class name matches file name                                  | 🔧      |
| [lwc/no-api-reassignments](./docs/rules/no-api-reassignments.md)                                                                       | prevent public property reassignments                                          |         |
| [lwc/no-deprecated](./docs/rules/no-deprecated.md)                                                                                     | disallow usage of deprecated LWC APIs                                          |         |
| [lwc/no-document-query](./docs/rules/no-document-query.md)                                                                             | disallow DOM query at the document level                                       |         |
| [lwc/no-attributes-during-construction](./docs/rules/no-attributes-during-construction.md)                                             | disallow setting attributes during construction                                |         |
| [lwc/no-disallowed-lwc-imports](./docs/rules/no-disallowed-lwc-imports.md)                                                             | disallow importing unsupported APIs from the `lwc` package                     |         |
| [lwc/no-leading-uppercase-api-name](./docs/rules/no-leading-uppercase-api-name.md)                                                     | ensure public property doesn't start with an upper-case character              |         |
| [lwc/no-unexpected-wire-adapter-usages](./docs/rules/no-unexpected-wire-adapter-usages.md)                                             | enforce wire adapters to be used with `wire` decorator                         |         |
| [lwc/no-unknown-wire-adapters](./docs/rules/no-unknown-wire-adapters.md)                                                               | disallow usage of unknown wire adapters                                        |         |
| [lwc/valid-api](./docs/rules/valid-api.md)                                                                                             | validate `api` decorator usage                                                 |         |
| [lwc/valid-track](./docs/rules/valid-track.md)                                                                                         | validate `track` decorator usage                                               |         |
| [lwc/valid-wire](./docs/rules/valid-wire.md)                                                                                           | validate `wire` decorator usage                                                |         |
| [lwc/valid-graphql-wire-adapter-callback-parameters](./docs/rules/valid-graphql-wire-adapter-callback-parameters.md)                   | ensure graphql wire adapters are using 'errors' instead of 'error'             |         |
| [lwc/no-host-mutation-in-connected-callback](./docs/rules/no-host-mutation-in-connected-callback.md)                                   | disallow the host element mutation in 'connectedCallback'                      |         |
| [lwc/consistent-component-name](./docs/rules/consistent-component-name.md)                                                             | ensure component class name matches file name                                  | 🔧      |
| [lwc/no-api-reassignments](./docs/rules/no-api-reassignments.md)                                                                       | prevent public property reassignments                                          |         |
| [lwc/no-deprecated](./docs/rules/no-deprecated.md)                                                                                     | disallow usage of deprecated LWC APIs                                          |         |
| [lwc/no-document-query](./docs/rules/no-document-query.md)                                                                             | disallow DOM query at the document level                                       |         |
| [lwc/no-attributes-during-construction](./docs/rules/no-attributes-during-construction.md)                                             | disallow setting attributes during construction                                |         |
| [lwc/no-disallowed-lwc-imports](./docs/rules/no-disallowed-lwc-imports.md)                                                             | disallow importing unsupported APIs from the `lwc` package                     |         |
| [lwc/no-leading-uppercase-api-name](./docs/rules/no-leading-uppercase-api-name.md)                                                     | ensure public property doesn't start with an upper-case character              |         |
| [lwc/no-unexpected-wire-adapter-usages](./docs/rules/no-unexpected-wire-adapter-usages.md)                                             | enforce wire adapters to be used with `wire` decorator                         |         |
| [lwc/no-unknown-wire-adapters](./docs/rules/no-unknown-wire-adapters.md)                                                               | disallow usage of unknown wire adapters                                        |         |
| [lwc/valid-api](./docs/rules/valid-api.md)                                                                                             | validate `api` decorator usage                                                 |         |
| [lwc/valid-track](./docs/rules/valid-track.md)                                                                                         | validate `track` decorator usage                                               |         |
| [lwc/valid-wire](./docs/rules/valid-wire.md)                                                                                           | validate `wire` decorator usage                                                |         |
| [lwc/ssr-no-restricted-browser-globals](./docs/rules/ssr/ssr-no-restricted-browser-globals.md)                                         | disallow access to global browser APIs during SSR                              |         |
| [lwc/ssr-no-unsupported-properties](./docs/rules/ssr/ssr-no-unsupported-properties.md)                                                 | disallow access of unsupported properties in SSR                               |         |
| [lwc/ssr-no-node-env](./docs/rules/ssr/ssr-no-node-env.md)                                                                             | disallow usage of process.env.NODE_ENV in SSR                                  |         |
| [lwc/ssr-no-disallowed-lwc-imports](./docs/rules/ssr/ssr-no-disallowed-lwc-imports.md)                                                 | restrict specific imports from the lwc package in SSR-able components          |         |
| [lwc/valid-graphql-wire-adapter-callback-parameters](./docs/rules/valid-graphql-wire-adapter-callback-parameters.md)                   | ensure graphql wire adapters are using 'errors' instead of 'error'             |         |
| [lwc/ssr-no-host-mutation-in-connected-callback](./docs/rules/ssr/ssr-no-host-mutation-in-connected-callback.md)                       | disallow the host element mutation in 'connectedCallback'                      |         |
| [lwc/ssr-no-static-imports-of-user-specific-scoped-modules](./docs/rules/ssr/ssr-no-static-imports-of-user-specific-scoped-modules.md) | disallow static imports of user-specific scoped modules in SSR-able components |         |
| [lwc/ssr-no-form-factor](./docs/rules/ssr/ssr-no-form-factor.md)                                                                       | disallow formFactor in SSR-able components                                     |         |

### Best practices

| Rule ID                                                                            | Description                                                | Fixable |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------- |
| [lwc/no-async-operation](./docs/rules/no-async-operation.md)                       | restrict usage of async operations                         |         |
| [lwc/no-dupe-class-members](./docs/rules/no-dupe-class-members.md)                 | disallow duplicate class members                           |         |
| [lwc/no-inner-html](./docs/rules/no-inner-html.md)                                 | disallow usage of `innerHTML`                              |         |
| [lwc/no-template-children](./docs/rules/no-template-children.md)                   | prevent accessing the immediate children of this.template  |         |
| [lwc/no-leaky-event-listeners](./docs/rules/no-leaky-event-listeners.md)           | prevent event listeners from leaking memory                |         |
| [lwc/prefer-custom-event](./docs/rules/prefer-custom-event.md)                     | suggest usage of `CustomEvent` over `Event` constructor    |         |
| [lwc/ssr-no-unsupported-node-api](./docs/rules/ssr/ssr-no-unsupported-node-api.md) | disallow unsupported Node API calls in SSR-able components |         |

### Compat performance

Older browsers like IE11 run LWC in compatibility mode. For more information about browser performance, please refer to [Supported Browsers](http://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.get_started_supported_browsers) in the Lightning Web Components Developer Guide.

| Rule ID                                                    | Description                                 | Fixable |
| ---------------------------------------------------------- | ------------------------------------------- | ------- |
| [lwc/no-async-await](./docs/rules/no-async-await.md)       | disallow usage of the async-await syntax    |         |
| [lwc/no-for-of](./docs/rules/no-for-of.md)                 | disallow usage of the for-of syntax         |         |
| [lwc/no-rest-parameter](./docs/rules/no-rest-parameter.md) | disallow usage of the rest parameter syntax |         |

### Deprecated

| Rule ID                                                            | Replaced by                                                                                    |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| [lwc/no-dupe-class-members](./docs/rules/no-dupe-class-members.md) | [no-dupe-class-members](https://eslint.org/docs/rules/no-dupe-class-members)(base eslint rule) |
