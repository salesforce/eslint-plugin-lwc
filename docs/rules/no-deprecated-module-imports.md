# Disallow use of deprecated module imports (`lwc/no-deprecated-module-imports`)

This rule prevents the use of deprecated module imports and suggests their modern replacements.

## Rule Details

This rule checks for imports from deprecated modules and provides automatic fixes to update them to their recommended replacements.

Currently deprecated modules:

-   `lightning/uiGraphQLApi` → Use `lightning/graphql` instead
    -   **Note:** `refreshGraphQL` is not available in `lightning/graphql`. Use `refresh` from the wire adapter result instead

Examples of **incorrect** code:

```javascript
import { gql, graphql } from 'lightning/uiGraphQLApi';
import * as graphqlApi from 'lightning/uiGraphQLApi';
import { refreshGraphQL } from 'lightning/uiGraphQLApi'; // Will not auto-fix
```

Examples of **correct** code:

```javascript
import { gql, graphql } from 'lightning/graphql';
import * as graphqlApi from 'lightning/graphql';
```

## Options

You can configure additional deprecated modules through the rule options:

```json
{
    "@lwc/lwc/no-deprecated-module-imports": [
        "error",
        {
            "deprecatedModules": {
                "old/module/path": {
                    "replacement": "new/module/path",
                    "message": "Custom deprecation message explaining why and what to use instead"
                }
            }
        }
    ]
}
```

### Options Schema

-   `deprecatedModules` (object): An object mapping deprecated module paths to their replacements
    -   Each entry should have:
        -   `replacement` (string): The module path to use instead
        -   `message` (string): The error message to display

## When Not To Use It

If your codebase has legitimate use cases for the deprecated modules (such as Mobile-Offline functionality for `lightning/uiGraphQLApi`), you may need to disable this rule for specific files or directories. See the (Wire Adapter Comparison)[https://developer.salesforce.com/docs/platform/lwc/guide/reference-graphql-intro.html#graphql-api-wire-adapter-comparison] for more details.

## Auto-fix

This rule provides automatic fixes that will replace deprecated module imports with their recommended alternatives. Use `--fix` with ESLint to automatically update your imports.

**Important:** Auto-fix is disabled when importing APIs that don't exist in the replacement module (such as `refreshGraphQL`). You'll need to manually update these imports and refactor your code to use the appropriate alternatives.
