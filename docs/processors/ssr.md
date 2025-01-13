# `ssr` Processor

## Overview

The `ssr` processor is designed to streamline the linting of SSR-capable Lightning Web Components (LWCs). By reading the metadata in the `js-meta.xml` file, the processor identifies whether a component supports Server-Side Rendering (SSR). For SSR-capable components, the processor generates virtual files in memory with a .ssrjs extension. These virtual files allow you to apply SSR-specific linting rules in a targeted manner.

## Key Features

-   SSR Capability Detection: The processor identifies components with SSR capabilities based on the js-meta.xml file.

-   Virtual File Creation: For each SSR-capable component, the processor creates corresponding .ssrjs virtual files.

-   Targeted Linting: These .ssrjs files can be processed with SSR-specific ESLint rules.

### **Usage**

The processor helps to specifically target ssr js files to apply ssr specific rules by reading `js-meta.xml` files of components.

**Example:**

```xml
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>50.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
    </targets>
    <capabilities>
        <capability>lightning__ServerRenderableWithHydration</capability> <!-- Indicate SSR capability here -->
    </capabilities>
</LightningComponentBundle>
```

In this example, the capabilities tag indicates whether the component supports SSR. If either of the following capabilities is defined:

-   lightning\_\_ServerRenderable
-   lightning\_\_ServerRenderableWithHydration

The processor will generate a `${filename}.ssrjs` virtual file for each js file associated with the component.

### Configuration Example

To configure the processor, ensure your ESLint configuration includes @lwc/eslint-plugin-lwc/ssr as a processor:

```
import lwcPlugin from '@lwc/eslint-plugin-lwc';
export default [
  {
    files: ['**/modules/**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false,
      },
    },
    plugins: {
      lwcPlugin
    },
    processor: lwcPlugin.processors.ssr
  },
  {
    files: ['**/modules/**/*.ssrjs'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false,
      },
    },
    plugins: {
      lwcPlugin
    },
    rules: {
          "no-console" : "error",
          "lwc/ssr-no-node-env": "error"
        }
  }
];
```

### Explanation of Configuration

-   Processor Configuration:

The processor key applies the ssr processor to all `**/modules/**/*.js` files.The processor then created a virtual files for all js files of ssrable components with `.ssrjs` extension/

-   Targeted Linting for .ssrjs Files:

A separate configuration block applies specific rules to these virtual `.ssrjs` files, ensuring SSR-specific rules like `lwc/ssr-no-node-env` are only applied SSR capable components.
