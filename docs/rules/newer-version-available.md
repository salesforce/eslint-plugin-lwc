# Suggest newer versions of module imports when available (`lwc/newer-version-available`)

This rule suggests using newer versions of module imports when they are available.

## Rule Details

This rule checks for imports from modules that have newer versions available and provides automatic fixes to update them to their recommended replacements.

Modules with newer versions available:

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

You can configure additional modules with newer versions through the rule options:

```json
{
    "@lwc/lwc/newer-version-available": [
        "error",
        {
            "modulesWithNewerVersions": {
                "old/module/path": {
                    "replacement": "new/module/path",
                    "message": "A newer version is available: use new/module/path instead."
                }
            }
        }
    ]
}
```

### Options Schema

-   `modulesWithNewerVersions` (object): An object mapping module paths to their newer versions
    -   Each entry should have:
        -   `replacement` (string): The newer module path to use instead
        -   `message` (string): The error message to display

## When Not To Use It

If your codebase has legitimate use cases for older module versions (such as Mobile-Offline functionality for `lightning/uiGraphQLApi`), you may need to disable this rule for specific files or directories. See the (Wire Adapter Comparison)[https://developer.salesforce.com/docs/platform/lwc/guide/reference-graphql-intro.html#graphql-api-wire-adapter-comparison] for more details.

## Auto-fix

This rule provides automatic fixes that will update module imports to their newer versions. Use `--fix` with ESLint to automatically update your imports.

**Important:** Auto-fix is disabled when importing APIs that don't exist in the newer version (such as `refreshGraphQL`). You'll need to manually update these imports and refactor your code to use the appropriate alternatives.
