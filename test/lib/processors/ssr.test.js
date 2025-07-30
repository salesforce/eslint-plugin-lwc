/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';
const { expect } = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const ssrProcessor = require('../../../lib/processors/ssr');

describe('JS Meta XML Processor with Capabilities Check', () => {
    let fsReadFileSync;
    let fsReadDirSync;

    beforeEach(() => {
        fsReadFileSync = sinon.stub(fs, 'readFileSync');
        fsReadDirSync = sinon.stub(fs, 'readdirSync');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('preprocess', () => {
        it('should process and create a new file with ssrjs extension if file is ssrable', () => {
            const input = 'const x = 1;';
            const filename = 'test/test.js';
            const validMetaXML = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                <capabilities>
                    <capability>lightning__ServerRenderable</capability>
                </capabilities>
                </LightningComponentBundle>
            `;

            fsReadFileSync.returns(validMetaXML);
            fsReadDirSync.returns(['test.js-meta.xml']);

            const result = ssrProcessor.preprocess(input, filename);

            expect(result).to.have.lengthOf(2);
            expect(result[1]).to.deep.equal({
                filename: 'test.ssrjs',
                text: 'const x = 1;',
            });
            expect(result[0]).to.deep.equal(input);
        });

        it('should skip creating new virtual file with ssrjs extension when meta exists but does not have ssr capability', () => {
            const input = 'const x = 1;';
            const filename = 'test1/test.js';
            const invalidMetaXML = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                </LightningComponentBundle>
            `;

            fsReadFileSync.returns(invalidMetaXML);
            fsReadDirSync.returns(['test.js-meta.xml']);

            const result = ssrProcessor.preprocess(input, filename);

            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.deep.equal(input);
        });

        it('should handle array of capabilities', () => {
            const input = 'const x = 1;';
            const filename = 'test2/test.js';
            const multipleCapabilitiesXML = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                    <capabilities>
                        <capability>lightning__dynamicComponent</capability>
                        <capability>lightning__ServerRenderableWithHydration</capability>
                    </capabilities>
                </LightningComponentBundle>
            `;

            fsReadFileSync.returns(multipleCapabilitiesXML);
            fsReadDirSync.returns(['test.js-meta.xml']);

            const result = ssrProcessor.preprocess(input, filename);

            expect(result).to.have.lengthOf(2);
        });

        it('should use cached result for file in same directory', () => {
            const input = 'const x = 1;';
            const filename = 'tests/test.js';
            const validMetaXML = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                <capabilities>
                    <capability>lightning__ServerRenderable</capability>
                </capabilities>
                </LightningComponentBundle>
            `;

            fsReadFileSync.returns(validMetaXML);
            fsReadDirSync.returns(['test.js-meta.xml']);

            const result = ssrProcessor.preprocess(input, filename);

            expect(result).to.have.lengthOf(2);
            expect(fsReadFileSync.callCount).to.equal(1);
            expect(fsReadDirSync.callCount).to.equal(1);

            // Second call with different file in same directory
            const input2 = 'const y = 2;';
            const filename2 = 'tests/test2.js';

            const result2 = ssrProcessor.preprocess(input2, filename2);

            // Verify second call
            expect(result2).to.have.lengthOf(2);
            // Verify fs functions weren't called again, i.e ssr check data for `tests` dir is picked from cached data from last run
            expect(fsReadFileSync.callCount).to.equal(1, 'readFileSync should not be called again');
            expect(fsReadDirSync.callCount).to.equal(1, 'readdirSync should not be called again');

            // Verify results structure
            expect(result2[0]).to.deep.equal(input2);
            expect(result2[1]).to.deep.equal({
                text: input2,
                filename: 'test2.ssrjs',
            });
        });
        it('should return same file for virtual file .ssrjs extension', () => {
            const input = 'const x = 1;';
            const filename = 'test2/test.ssrjs';
            const testXML = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                    <capabilities>
                        <capability>lightning__ServerRenderableWithHydration</capability>
                    </capabilities>
                </LightningComponentBundle>
            `;

            fsReadFileSync.returns(testXML);
            fsReadDirSync.returns(['test.js-meta.xml']);

            const result = ssrProcessor.preprocess(input, filename);
            expect(result[0]).to.deep.equal(input);
        });
    });

    describe('postprocess', () => {
        it('should filter out unused eslint-disable directive warnings for SSR rules', () => {
            const messages = [
                [
                    // Messages from original file
                    {
                        ruleId: null,
                        message:
                            "Unused eslint-disable directive (no problems were reported from '@lwc/lwc/ssr-no-node-env')",
                        line: 1,
                        column: 1,
                        severity: 1,
                    },
                    {
                        ruleId: 'no-console',
                        message: 'Unexpected console statement.',
                        line: 2,
                        column: 1,
                        severity: 2,
                    },
                ],
                [
                    // Messages from virtual .ssrjs file
                    {
                        ruleId: '@lwc/lwc/ssr-no-node-env',
                        message: 'process.env usage is not allowed',
                        line: 3,
                        column: 1,
                        severity: 2,
                    },
                ],
            ];

            const result = ssrProcessor.postprocess(messages);

            expect(result).to.have.lengthOf(2);
            // Should keep non-SSR messages
            expect(result[0]).to.deep.include({ ruleId: 'no-console' });
            expect(result[1]).to.deep.include({ ruleId: '@lwc/lwc/ssr-no-node-env' });
            // Should filter out SSR unused disable directive warning
            expect(
                result.some(
                    (msg) => msg.message && msg.message.includes("'@lwc/lwc/ssr-no-node-env'"),
                ),
            ).to.be.false;
        });

        it('should keep unused eslint-disable directive warnings for non-SSR rules', () => {
            const messages = [
                [
                    // Messages from original file
                    {
                        ruleId: null,
                        message:
                            "Unused eslint-disable directive (no problems were reported from 'no-console')",
                        line: 1,
                        column: 1,
                        severity: 1,
                    },
                    {
                        ruleId: null,
                        message:
                            "Unused eslint-disable directive (no problems were reported from '@lwc/lwc/ssr-no-node-env')",
                        line: 2,
                        column: 1,
                        severity: 1,
                    },
                ],
            ];

            const result = ssrProcessor.postprocess(messages);

            expect(result).to.have.lengthOf(1);
            // Should keep non-SSR unused disable directive warning
            expect(result[0].message).to.include("'no-console'");
            // Should filter out SSR unused disable directive warning
            expect(
                result.some(
                    (msg) => msg.message && msg.message.includes("'@lwc/lwc/ssr-no-node-env'"),
                ),
            ).to.be.false;
        });

        it('should handle multiple SSR rules in unused disable directive warnings', () => {
            const messages = [
                [
                    {
                        ruleId: null,
                        message:
                            "Unused eslint-disable directive (no problems were reported from '@lwc/lwc/ssr-no-node-env', '@lwc/lwc/ssr-no-form-factor')",
                        line: 1,
                        column: 1,
                        severity: 1,
                    },
                ],
            ];

            const result = ssrProcessor.postprocess(messages);

            expect(result).to.have.lengthOf(0);
            // Should filter out the entire message since it only contains SSR rules
        });

        it('should preserve unused disable directive warnings when mixed with non-SSR rules', () => {
            const messages = [
                [
                    {
                        ruleId: null,
                        message:
                            "Unused eslint-disable directive (no problems were reported from '@lwc/lwc/ssr-no-node-env', 'no-console')",
                        line: 1,
                        column: 1,
                        severity: 1,
                    },
                ],
            ];

            const result = ssrProcessor.postprocess(messages);

            expect(result).to.have.lengthOf(1);
            // Should keep the entire message unchanged - once developer fixes non-SSR rule, SSR rule gets handled automatically
            expect(result[0].message).to.equal(
                "Unused eslint-disable directive (no problems were reported from '@lwc/lwc/ssr-no-node-env', 'no-console')",
            );
        });

        it('should handle mixed ordering of SSR and non-SSR rules', () => {
            const messages = [
                [
                    {
                        ruleId: null,
                        message:
                            "Unused eslint-disable directive (no problems were reported from '@lwc/lwc/ssr-no-node-env', 'no-console', '@lwc/lwc/ssr-no-form-factor')",
                        line: 1,
                        column: 1,
                        severity: 1,
                    },
                ],
            ];

            const result = ssrProcessor.postprocess(messages);

            expect(result).to.have.lengthOf(1);
            // Should keep the entire message unchanged regardless of rule order
            expect(result[0].message).to.equal(
                "Unused eslint-disable directive (no problems were reported from '@lwc/lwc/ssr-no-node-env', 'no-console', '@lwc/lwc/ssr-no-form-factor')",
            );
        });

        it('should handle complex mixed rule scenarios', () => {
            const messages = [
                [
                    {
                        ruleId: null,
                        message:
                            "Unused eslint-disable directive (no problems were reported from 'no-unused-vars', '@lwc/lwc/ssr-no-node-env', 'prefer-const')",
                        line: 1,
                        column: 1,
                        severity: 1,
                    },
                    {
                        ruleId: null,
                        message:
                            "Unused eslint-disable directive (no problems were reported from '@lwc/lwc/ssr-no-restricted-browser-globals')",
                        line: 2,
                        column: 1,
                        severity: 1,
                    },
                ],
            ];

            const result = ssrProcessor.postprocess(messages);

            expect(result).to.have.lengthOf(1);
            // Should keep the first message (mixed rules) unchanged and filter out the second (SSR only)
            expect(result[0].message).to.equal(
                "Unused eslint-disable directive (no problems were reported from 'no-unused-vars', '@lwc/lwc/ssr-no-node-env', 'prefer-const')",
            );
        });

        it('should pass through all other types of messages unchanged', () => {
            const messages = [
                [
                    {
                        ruleId: 'no-console',
                        message: 'Unexpected console statement.',
                        line: 1,
                        column: 1,
                        severity: 2,
                    },
                    {
                        ruleId: '@lwc/lwc/valid-api',
                        message: 'Invalid API usage.',
                        line: 2,
                        column: 1,
                        severity: 2,
                    },
                ],
            ];

            const result = ssrProcessor.postprocess(messages);

            expect(result).to.have.lengthOf(2);
            expect(result).to.deep.equal(messages.flat());
        });
    });
});
