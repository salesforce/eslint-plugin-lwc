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

const metaCache = new Map(); // Cache to store processed directories and their SSR status

function hasSSRCapabilities(dir) {
    // Check if the result for this directory is cached
    if (metaCache.has(dir)) {
        return metaCache.get(dir);
    }

    const JS_META_REGEX = /\.js-meta\.xml$/i; // Regular expression to match meta.xml files
    const metaFile = fs.readdirSync(dir).find((file) => JS_META_REGEX.test(file));

    if (!metaFile) {
        metaCache.set(dir, false); // Cache the result for this directory
        return false;
    }

    const metaFilePath = path.join(dir, metaFile);
    const content = fs.readFileSync(metaFilePath, 'utf8');
    let xmlRoot;
    try {
        xmlRoot = new XMLParser({
            isArray: (_name, jPath) => jPath === 'LightningComponentBundle.capabilities',
        }).parse(content);
    } catch (error) {
        // If XML parsing fails, return false to indicate no SSR capabilities
        console.warn(`Failed to parse XML for ${metaFilePath}: ${error.message}`);
        return false;
    }

    const bundle = xmlRoot.LightningComponentBundle;
    const hasSSR =
        bundle && bundle.capabilities
            ? bundle.capabilities.some((capabilityObj) =>
                  Array.isArray(capabilityObj.capability)
                      ? capabilityObj.capability.some((cap) => SSR_CAPABILITIES.includes(cap))
                      : SSR_CAPABILITIES.includes(capabilityObj.capability),
              )
            : false;

    // Cache the result for future use
    metaCache.set(dir, hasSSR);
    return hasSSR;
}

// processor to only lint js files for components marked as ssrable in their .js-meta.xml capabilities
module.exports = {
    preprocess(text, filename) {
        // If the file already has the .ssrjs return same file
        if (filename.endsWith('.ssrjs')) {
            return [text];
        }
        const dirName = path.dirname(filename); // Extract the directory name from the full file path
        const baseFileName = path.basename(filename);
        const updatedFileName = baseFileName.replace(/(js|ts)$/, 'ssr$1');
        // Check SSR capabilities before processing
        if (!hasSSRCapabilities(dirName)) {
            return [text];
        }
        // Creates a copy file for every ssr component js file with `${filePath}/${fileName}.ssrjs` path
        return [text, { text, filename: updatedFileName }];
    },

    postprocess(messages) {
        // Return all messages for files that were processed
        return messages.flat();
    },
    supportsAutofix: true,
};
