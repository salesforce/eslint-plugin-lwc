/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { testRule, testTypeScript } = require('../shared');

testRule('no-import-of-scoped-modules-during-ssr', {
    valid: [
        {
            code: `import { LightningElement } from 'lwc';
                   
                   class MyComponent extends LightningElement {
                
                   connectedCallback() {
                        // No user-scoped or featureFlag modules here
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import userId from '@salesforce/user/Id';

                export default class Foo extends LightningElement {
                    connectedCallback() {
                        console.log(userId);
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Static import of @salesforce user modules is not allowed in server-side rendered components.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import { formFactor } from '@salesforce/client/formFactor';

                export default class MyComponent extends LightningElement {
                    connectedCallback() {
                        console.log(formFactor);
                    }
                }
            `,
            errors: [
                {
                    message:
                        "Using '@salesforce/client/formFactor' is discouraged in server-side components; use CSS media queries instead.",
                },
            ],
        },
        {
            code: `
                import { isFeatureEnabled } from '@salesforce/featureFlag';

                export default class MyComponent extends LightningElement {
                    connectedCallback() {
                        console.log(isFeatureEnabled('someFeature'));
                    }
                }
            `,
            errors: [
                {
                    message:
                        "Using '@salesforce/featureFlag' is discouraged in server-side components.",
                },
            ],
        },
        {
            code: `
                class MyComponent extends LightningElement {
                    connectedCallback() {
                        import('@salesforce/user/Id').then((module) => {
                            console.log(module);
                        });
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Dynamic import of user-scoped modules is not allowed in server-side rendered components. User-scoped values should either be retrieved from a specific cookie or derived from the existing SID cookie.',
                },
            ],
        },
    ],
});

testTypeScript('no-import-of-scoped-modules-during-ssr', {
    valid: [
        {
            code: `import { LightningElement } from 'lwc';
                    class MyComponent extends LightningElement {
                    connectedCallback() {
                        // No user-scoped or featureFlag modules in use
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import isGuest from '@salesforce/user/isGuest';

                export default class Foo extends LightningElement {
                    connectedCallback() {
                        console.log(isGuest);
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Static import of @salesforce user modules is not allowed in server-side rendered components.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import { formFactor } from '@salesforce/client/formFactor';

                export default class MyComponent extends LightningElement {
                    connectedCallback() {
                        console.log(formFactor);
                    }
                }
            `,
            errors: [
                {
                    message:
                        "Using '@salesforce/client/formFactor' is discouraged in server-side components; use CSS media queries instead.",
                },
            ],
        },
        {
            code: `
                import { isFeatureEnabled } from '@salesforce/featureFlag';

                export default class MyComponent extends LightningElement {
                    connectedCallback() {
                        console.log(isFeatureEnabled('someFeature'));
                    }
                }
            `,
            errors: [
                {
                    message:
                        "Using '@salesforce/featureFlag' is discouraged in server-side components.",
                },
            ],
        },
        {
            code: `
                class MyComponent extends LightningElement {
                    connectedCallback() {
                        import('@salesforce/user/isGuest').then((module) => {
                            console.log(module);
                        });
                    }
                }
            `,
            errors: [
                {
                    message:
                        'Dynamic import of user-scoped modules is not allowed in server-side rendered components. User-scoped values should either be retrieved from a specific cookie or derived from the existing SID cookie.',
                },
            ],
        },
    ],
});
