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
const { ssrProcessor } = require('../../../lib/processors/ssr');

describe('JS Meta XML Processor with Capabilities Check', () => {
    let fsExistsSync;
    let fsReadFileSync;

    beforeEach(() => {
        fsExistsSync = sinon.stub(fs, 'existsSync');
        fsReadFileSync = sinon.stub(fs, 'readFileSync');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('preprocess', () => {
        it('should process file when meta exists and has ssr capability', () => {
            const input = 'const x = 1;';
            const filename = '/path/to/file/script.js';
            const validMetaXML = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                <capabilities>
                    <capability>lightning__ServerRenderable</capability>
                    <capability>lightning__ServerRenderableWithHydration</capability>
                </capabilities>
                </LightningComponentBundle>
            `;

            fsExistsSync.returns(true);
            fsReadFileSync.returns(validMetaXML);
            const result = ssrProcessor.preprocess(input, filename);

            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.deep.equal({
                text: input,
                filename: filename,
            });
        });

        it('should skip file when meta exists but does not have ssr capability', () => {
            const input = 'const x = 1;';
            const filename = '/path/to/file/script.js';
            const invalidMetaXML = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                </LightningComponentBundle>
            `;

            fsExistsSync.returns(true);
            fsReadFileSync.returns(invalidMetaXML);

            const result = ssrProcessor.preprocess(input, filename);

            expect(result).to.have.lengthOf(0);
        });

        it('should handle array of capabilities', () => {
            const input = 'const x = 1;';
            const filename = '/path/to/file/script.js';
            const multipleCapabilitiesXML = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                    <capabilities>
                        <capability>lightning__ServerRenderable</capability>
                        <capability>lightning__ServerRenderableWithHydration</capability>
                    </capabilities>
                </LightningComponentBundle>
            `;

            fsExistsSync.returns(true);
            fsReadFileSync.returns(multipleCapabilitiesXML);

            const result = ssrProcessor.preprocess(input, filename);

            expect(result).to.have.lengthOf(1);
        });
    });
});
