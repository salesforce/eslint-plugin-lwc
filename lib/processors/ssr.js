/*
 * Copyright (c) 2024, salesforce.com, inc.
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

function hasSSRCapabilities(filePath) {
    const JS_META_REGEX = /meta\.xml$/i; // Regular expression to match meta.xml files
    const dir = path.dirname(filePath);
    const metaFile = fs.readdirSync(dir).find((file) => JS_META_REGEX.test(file));

    if (fs.existsSync(metaFile)) {
        const content = fs.readFileSync(metaFile, 'utf8');
        const xmlRoot = new XMLParser({
            isArray: (_name, jPath) => jPath === 'LightningComponentBundle.capabilities',
        }).parse(content);

        const bundle = xmlRoot.LightningComponentBundle;
        if (bundle && bundle.capabilities) {
            return xmlRoot.LightningComponentBundle.capabilities.some((capabilityObj) =>
                Array.isArray(capabilityObj.capability)
                    ? capabilityObj.capability.some((cap) => SSR_CAPABILITIES.includes(cap))
                    : SSR_CAPABILITIES.includes(capabilityObj.capability),
            );
        }
    }
    return false;
}

// processor to only lint js files for components marked as ssrable in there .js-meta.xml capabilities
module.exports = {
    preprocess(text, filename) {
        // Check SSR capabilities before processing
        if (!hasSSRCapabilities(filename)) {
            return []; // Ignore file by returning an empty array
        }
        // Process the file if it has SSR capabilities
        return [{ text, filename }];
    },

    postprocess(messages) {
        // Return all messages for files that were processed
        return [].concat(...messages);
    },

    supportsAutofix: true,
};
