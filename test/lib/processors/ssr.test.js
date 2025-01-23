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
            expect(result).to.deep.equal(input);
        });
    });
});
