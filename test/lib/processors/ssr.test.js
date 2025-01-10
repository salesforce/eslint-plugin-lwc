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
            expect(result[0]).to.deep.equal({
                text: input,
                filename: filename,
            });
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
            const filename = 'test/test.js';
            const result = ssrProcessor.preprocess(input, filename);
            expect(result).to.have.lengthOf(2);
        });
    });
});
