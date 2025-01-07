# `ssr` Processor

## Overview

The `ssr` processor is responsible for validating and applying linting to files that are SSR (Server-Side Rendering) capable in the Lightning Web Component ecosystem. It ensures that the component code adheres to SSR best practices, applying linting rules and transformations only when the component is verified to have SSR capabilities.

## Processor Details

### **How It Works**

The processor reads the metadata of a component, particularly the `js-meta.xml` file, to determine whether it has SSR capabilities. If the component is SSR-capable, it proceeds with linting and applying relevant rules for SSR compliance. If the component is not SSR-capable, it is skipped.

### **Usage**

The processor only lints JS files of SSR-capable components, i.e components that have the appropriate capabilities defined in metadata (`js-meta.xml` file).

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
        <capability>lightning__ServerRenderable</capability>
        <capability>lightning__ServerRenderableWithHydration</capability> <!-- Indicate SSR capability here -->
    </capabilities>
</LightningComponentBundle>
```

In this example, the capabilities tag is used to define whether the component is SSR-capable. If any of above two defined capapbilities is listed, the processor will proceed to apply rules and transformations to the associated .js file.

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
    processor: 'lwcPlugin/ssr',
    rules: {
      'no-console': 'error',
    },
  },
];

```