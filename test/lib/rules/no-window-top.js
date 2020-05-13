/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-window-top');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

const errors = [
    {
        message: 'Use of window.top is prohibited.',
    },
];

ruleTester.run('no-window-top', rule, {
    valid: [
        {
            code: `
                const top = {};
                function scope() {
                    top;
                }
            `,
        },
        {
            code: `
                function scope(top) {
                    function nested() {
                        top;
                    }
                }
            `,
        },
        {
            code: `
                function top() {
                    function nested() {
                        top;
                    }
                }
            `,
        },
        {
            code: `
                const document = { defaultView: { top: {} } };

                function scope() {
                    document.defaultView.top;
                }
            `,
        },
        {
            code: `
                function scope(document) {
                    function nested() {
                        document.defaultView.top;
                    }
                }
            `,
        },
        {
            code: `
                function document() {
                    function nested() {
                        document.defaultView.top;
                    }
                }
            `,
        },
        {
            code: `
                const frames = { top: {} };

                function scope() {
                    frames.top;
                }
            `,
        },
        {
            code: `
                function scope(frames) {
                    function nested() {
                        frames.top;
                    }
                }
            `,
        },
        {
            code: `
                function frames() {
                    function nested() {
                        frames.top;
                    }
                }
            `,
        },
        {
            code: `
                const globalThis = { top: {} };

                function scope() {
                    globalThis.top;
                }
            `,
        },
        {
            code: `
                function scope(globalThis) {
                    function nested() {
                        globalThis.top;
                    }
                }
            `,
        },
        {
            code: `
                function globalThis() {
                    function nested() {
                        globalThis.top;
                    }
                }
            `,
        },
        {
            code: `
                const self = { top: {} };

                function scope() {
                    self.top;
                }
            `,
        },
        {
            code: `
                function scope(self) {
                    function nested() {
                        self.top;
                    }
                }
            `,
        },
        {
            code: `
                function self() {
                    function nested() {
                        self.top;
                    }
                }
            `,
        },
        {
            code: `
                const window = { top: {} };

                function scope() {
                    window.top;
                }
            `,
        },
        {
            code: `
                function scope(window) {
                    function nested() {
                        window.top;
                    }
                }
            `,
        },
        {
            code: `
                function window() {
                    function nested() {
                        window.top;
                    }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `top;`,
            output: `window;`,
            errors,
        },
        {
            code: `document.defaultView.top;`,
            output: `window;`,
            errors,
        },
        {
            code: `frames.top;`,
            output: `window;`,
            errors,
        },
        {
            code: `globalThis.top;`,
            output: `window;`,
            errors,
        },
        {
            code: `self.top;`,
            output: `window;`,
            errors,
        },
        {
            code: `window.top;`,
            output: `window;`,
            errors,
        },
        {
            code: `
                const o = {
                    document() {
                        function nested() {
                            document.defaultView.top;
                        }
                    }
                };
            `,
            output: `
                const o = {
                    document() {
                        function nested() {
                            window;
                        }
                    }
                };
            `,
            errors,
        },
        {
            code: `
                const o = {
                    frames() {
                        function nested() {
                            frames.top;
                        }
                    }
                };
            `,
            output: `
                const o = {
                    frames() {
                        function nested() {
                            window;
                        }
                    }
                };
            `,
            errors,
        },
        {
            code: `
                const o = {
                    globalThis() {
                        function nested() {
                            globalThis.top;
                        }
                    }
                };
            `,
            output: `
                const o = {
                    globalThis() {
                        function nested() {
                            window;
                        }
                    }
                };
            `,
            errors,
        },
        {
            code: `
                const o = {
                    self() {
                        function nested() {
                            self.top;
                        }
                    }
                };
            `,
            output: `
                const o = {
                    self() {
                        function nested() {
                            window;
                        }
                    }
                };
            `,
            errors,
        },
        {
            code: `
                const o = {
                    window() {
                        function nested() {
                            window.top;
                        }
                    }
                };
            `,
            output: `
                const o = {
                    window() {
                        function nested() {
                            window;
                        }
                    }
                };
            `,
            errors,
        },
    ],
});
