# `ssr` Processor

## Overview

The `ssr` processor is responsible for validating and applying transformations to files that are SSR (Server-Side Rendering) capable in the Lightning Web Component (LWC) ecosystem. It ensures that the component code adheres to SSR best practices, applying specific linting rules and transformations only when the component is verified to have SSR capabilities.

## Processor Details

### **How It Works**

The processor reads the metadata of a component, particularly the `meta.xml` file, to determine whether it has SSR capabilities. If the component is SSR-capable, it proceeds with linting and applying relevant rules for SSR compliance. If the component is not SSR-capable, it is skipped.

### **Usage**

The processor onlyt lints js files of ssrable components i.e component has the appropriate metadata (`.xml`) file with SSR-related capabilities.

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

In this example, the capabilities tag is used to define whether the component is SSR-capable. If ssr is listed in the capabilities, the processor will proceed to apply SSR-specific rules and transformations to the associated .js file.

### Configuration Example

To configure the processor, ensure your ESLint configuration includes @lwc/eslint-plugin-lwc/ssr as a processor:

```
module.exports = {
    processors: {
        '.js': '@lwc/eslint-plugin-lwc/ssr',
    },
    rules: {
        '@lwc/lwc/no-static-imports-of-user-specific-scoped-modules': 'error',
        '@lwc/lwc/no-host-mutation-in-connected-callback': 'warn',
    },
};
```
