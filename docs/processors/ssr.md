# `ssr` Processor

## Overview

The `ssr` processor reads the metadata of a component, particularly the `js-meta.xml` file, to determine whether it has SSR capabilities. If the component is SSR-capable, processor creates a new virtual file in memory with .srrjs extension which you can target using configs to specifically apply ssr rules to these files.

### **Usage**

The processor helps to specifically target ssr js files to apply ssr specific rules.
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

In this example, the capabilities tag is used to define whether the component is SSR-capable. If any of above two defined capapbilities is listed, the processor will process the component js files and add a new virtual file for every js file of ssrable component with .ssrjs extension.

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
