/*jslint node: true */
'use strict';

const URL = require('url');
const needle = require('needle');

/**
 * Basic web page fetching command
 * 
 * @function fetch
 * @param {string} url - URL to fetch
 * @param {object} [options] - Optional configuration for the fetch
 * @returns {Promise} Promise resolving with fetched page content
 */
function Fetch(context, data, next, done) {
    const defaultOptions = {
        timeout: 30000,  // 30 seconds
        follow_max: 5,   // Max redirects
        compressed: true,
        parse: true
    };

    // Merge user options with defaults
    const opts = { ...defaultOptions, ...(data || {}) };

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