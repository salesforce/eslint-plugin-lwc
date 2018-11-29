'use strict';

const rules = {
    'no-async-await': require('./rules/no-async-await.js'),
    'no-async-operation': require('./rules/no-async-operation'),
    'no-deprecated': require('./rules/no-deprecated.js'),
    'no-document-query': require('./rules/no-document-query.js'),
    'no-for-of': require('./rules/no-for-of.js'),
    'no-inner-html': require('./rules/no-inner-html.js'),
    'no-rest-parameter': require('./rules/no-rest-parameter.js'),
    'valid-api': require('./rules/valid-api.js'),
    'valid-track': require('./rules/valid-track.js'),
    'valid-wire': require('./rules/valid-wire.js'),
};

module.exports = {
    rules,
};
