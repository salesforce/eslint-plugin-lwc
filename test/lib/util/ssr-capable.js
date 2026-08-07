/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const path = require('path');
const sinon = require('sinon');
const { expect } = require('chai');

const { isSsrEnabled, onlyInSsr } = require('../../../lib/util/ssr-capable');

const FIXTURES = path.resolve(__dirname, '../../fixtures');
const ssrEnabledFile = path.join(FIXTURES, 'ssr-enabled/component.js');
const ssrDisabledFile = path.join(FIXTURES, 'ssr-disabled/component.js');

describe('isSsrEnabled', () => {
    it('is true when the bundle meta declares an SSR capability', () => {
        expect(isSsrEnabled({ filename: ssrEnabledFile })).to.equal(true);
    });

    it('is false when the bundle meta declares no SSR capability', () => {
        expect(isSsrEnabled({ filename: ssrDisabledFile })).to.equal(false);
    });

    it('is true when the bundle meta lists several capabilities including an SSR one', () => {
        const file = path.join(FIXTURES, 'ssr-multi-capability/component.js');
        expect(isSsrEnabled({ filename: file })).to.equal(true);
    });

    it('is false when the meta file cannot be read', () => {
        const warn = sinon.stub(console, 'warn');
        try {
            const file = path.join(FIXTURES, 'ssr-unreadable-meta/component.js');
            expect(isSsrEnabled({ filename: file })).to.equal(false);
            expect(warn.calledOnce).to.equal(true);
        } finally {
            warn.restore();
        }
    });

    it('is false for source nested in subfolders (only the co-located meta is read)', () => {
        const nested = path.join(FIXTURES, 'ssr-enabled/helpers/deep/util.js');
        expect(isSsrEnabled({ filename: nested })).to.equal(false);
    });

    it("is false when the file's own directory has no meta file", () => {
        expect(isSsrEnabled({ filename: path.resolve('/does-not-exist/component.js') })).to.equal(
            false,
        );
    });

    it('is false when there is no resolvable filename', () => {
        expect(isSsrEnabled({ filename: undefined })).to.equal(false);
    });

    it('supports the legacy getFilename() accessor', () => {
        expect(isSsrEnabled({ getFilename: () => ssrEnabledFile })).to.equal(true);
    });
});

describe('onlyInSsr', () => {
    it('delegates to the wrapped create for SSR-able components', () => {
        const visitors = { Program() {} };
        const create = onlyInSsr(() => visitors);
        expect(create({ filename: ssrEnabledFile })).to.equal(visitors);
    });

    it('returns an empty visitor object for non-SSR components', () => {
        let called = false;
        const create = onlyInSsr(() => {
            called = true;
            return { Program() {} };
        });
        expect(create({ filename: ssrDisabledFile })).to.deep.equal({});
        expect(called).to.equal(false);
    });
});
