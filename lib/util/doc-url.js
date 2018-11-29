'use strict';

const { version, repository } = require('../../package.json');

function docUrl(ruleName) {
    return `${repository.url}/blob/${version}/docs/rules/${ruleName}.md`;
}

module.exports = {
    docUrl,
};
