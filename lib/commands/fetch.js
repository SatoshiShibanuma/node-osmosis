/*jslint node: true */
'use strict';

const URL = require('url');

/**
 * Basic web page fetching command
 * 
 * @function fetch
 * @param {string} url - URL to fetch
 * @param {object} [options] - Optional configuration for the fetch
 * @returns {Function} Chainable command
 */
function Fetch(context, data, next, done) {
    this.request(this.name, 
        context, 
        this.getURL(this.url, context, data),
        {},  // params
        function(err, context) {
            if (err === null) {
                next(context, data);
            }
            done();
        }
    );
}

module.exports.fetch = function(url, options = {}) {
    if (typeof url !== 'string') {
        throw new Error('URL must be a string');
    }

    this.url = url;
    return Fetch;
};