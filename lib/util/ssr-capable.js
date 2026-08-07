/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const path = require('path');
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const SSR_CAPABILITIES = [
    'lightning__ServerRenderable',
    'lightning__ServerRenderableWithHydration',
];

const JS_META_REGEX = /\.js-meta\.xml$/i;

// A component's SSR capability lives in its bundle's *.js-meta.xml, not in the linted
// source. Reading and parsing that file is expensive, and every SSR rule asks the same
// question for every file in a bundle, so the answer is memoized per directory.
const ssrCapabilityByDir = new Map();

function findMetaFile(dir) {
    try {
        return fs.readdirSync(dir).find((file) => JS_META_REGEX.test(file));
    } catch {
        // Directory is unreadable (e.g. linting stdin with no resolvable path).
        return undefined;
    }
}

function metaFileDeclaresSsr(metaFilePath) {
    try {
        const xmlRoot = new XMLParser({
            isArray: (_name, jPath) => jPath === 'LightningComponentBundle.capabilities',
        }).parse(fs.readFileSync(metaFilePath, 'utf8'));

        const bundle = xmlRoot.LightningComponentBundle;
        if (!bundle || !bundle.capabilities) {
            return false;
        }
        return bundle.capabilities.some((capabilityObj) =>
            Array.isArray(capabilityObj.capability)
                ? capabilityObj.capability.some((cap) => SSR_CAPABILITIES.includes(cap))
                : SSR_CAPABILITIES.includes(capabilityObj.capability),
        );
    } catch (error) {
        console.warn(`Failed to parse XML for ${metaFilePath}: ${error.message}`);
        return false;
    }
}

// Only the meta co-located in the file's own directory is consulted. This matches the
// bundle-root entry file and its same-level helpers; source nested in subfolders is not
// yet resolved to its owning bundle (a future enhancement).
function resolveSsrCapability(dir) {
    if (ssrCapabilityByDir.has(dir)) {
        return ssrCapabilityByDir.get(dir);
    }

    const metaFile = findMetaFile(dir);
    const result = metaFile ? metaFileDeclaresSsr(path.join(dir, metaFile)) : false;

    ssrCapabilityByDir.set(dir, result);
    return result;
}

/**
 * Whether the component currently being linted declares an SSR capability
 * (`lightning__ServerRenderable` or `lightning__ServerRenderableWithHydration`) in its
 * `*.js-meta.xml`. SSR rules use this to run only against server-renderable components.
 */
function isSsrEnabled(context) {
    let filename = context.filename;
    if (typeof filename !== 'string' && typeof context.getFilename === 'function') {
        filename = context.getFilename();
    }
    if (typeof filename !== 'string' || filename === '') {
        return false;
    }
    return resolveSsrCapability(path.dirname(filename));
}

/**
 * Wraps a rule's `create` so its visitors only run for SSR-able components. Non-SSR
 * components get an empty visitor object, i.e. the rule reports nothing.
 */
function onlyInSsr(create) {
    return (context) => (isSsrEnabled(context) ? create(context) : {});
}

module.exports = { isSsrEnabled, onlyInSsr };
