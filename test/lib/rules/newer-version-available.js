/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('newer-version-available', {
    valid: [
        {
            code: `import { gql, graphql } from 'lightning/graphql';`,
        },
        {
            code: `import { LightningElement } from 'lwc';`,
        },
        {
            code: `import { wire } from 'lwc';`,
        },
        {
            code: `const module = 'lightning/uiGraphQLApi'; // just a string, not an import`,
        },
        {
            code: `// This is allowed with empty modules with newer versions list
                   import something from 'some/module';`,
            options: [{ modulesWithNewerVersions: {} }],
        },
    ],
    invalid: [
        {
            code: `import { gql, graphql } from 'lightning/uiGraphQLApi';`,
            errors: [
                {
                    message:
                        'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
                },
            ],
            output: `import { gql, graphql } from 'lightning/graphql';`,
        },
        {
            code: `import { gql } from 'lightning/uiGraphQLApi';`,
            errors: [
                {
                    message:
                        'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
                },
            ],
            output: `import { gql } from 'lightning/graphql';`,
        },
        {
            code: `import { graphql } from 'lightning/uiGraphQLApi';`,
            errors: [
                {
                    message:
                        'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
                },
            ],
            output: `import { graphql } from 'lightning/graphql';`,
        },
        {
            code: `import graphqlApi from 'lightning/uiGraphQLApi';`,
            errors: [
                {
                    message:
                        'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
                },
            ],
            output: `import graphqlApi from 'lightning/graphql';`,
        },
        {
            code: `import * as graphqlApi from 'lightning/uiGraphQLApi';`,
            errors: [
                {
                    message:
                        'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
                },
            ],
            output: `import * as graphqlApi from 'lightning/graphql';`,
        },
        {
            // Test refreshGraphQL import - should warn and NOT auto-fix
            code: `import { refreshGraphQL } from 'lightning/uiGraphQLApi';`,
            errors: [
                {
                    message:
                        'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
                },
                {
                    message:
                        '"refreshGraphQL" is not available in lightning/graphql. Use refresh from the wire adapter result instead.',
                },
            ],
            output: null, // No auto-fix because refreshGraphQL doesn't exist in replacement
        },
        {
            // Test mixed imports with refreshGraphQL - should warn and NOT auto-fix
            code: `import { gql, graphql, refreshGraphQL } from 'lightning/uiGraphQLApi';`,
            errors: [
                {
                    message:
                        'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
                },
                {
                    message:
                        '"refreshGraphQL" is not available in lightning/graphql. Use refresh from the wire adapter result instead.',
                },
            ],
            output: null, // No auto-fix because refreshGraphQL doesn't exist in replacement
        },
        {
            // Test custom modules with newer versions through options
            code: `import something from 'old/deprecated/module';`,
            options: [
                {
                    modulesWithNewerVersions: {
                        'old/deprecated/module': {
                            replacement: 'new/modern/module',
                            message:
                                'A newer version is available: use new/modern/module instead of old/deprecated/module.',
                        },
                    },
                },
            ],
            errors: [
                {
                    message:
                        'A newer version is available: use new/modern/module instead of old/deprecated/module.',
                },
            ],
            output: `import something from 'new/modern/module';`,
        },
    ],
});

testTypeScript('newer-version-available', {
    valid: [
        {
            code: `import { gql, graphql } from 'lightning/graphql';
                   import { LightningElement } from 'lwc';

                   export default class Test extends LightningElement {}`,
        },
    ],
    invalid: [
        {
            code: `import { gql, graphql } from 'lightning/uiGraphQLApi';
                   import { LightningElement } from 'lwc';

                   export default class Test extends LightningElement {}`,
            errors: [
                {
                    message:
                        'A newer version is available: use "lightning/graphql" instead of "lightning/uiGraphQLApi" for non Mobile-Offline use cases.',
                },
            ],
            output: `import { gql, graphql } from 'lightning/graphql';
                   import { LightningElement } from 'lwc';

                   export default class Test extends LightningElement {}`,
        },
    ],
});
