/*jslint node: true */
'use strict';

const URL = require('url');

/**
 * Basic web page fetching command with logging and timeout
 * 
 * @function fetch
 * @param {string} url - URL to fetch
 * @param {object} [options] - Optional configuration for the fetch
 * @returns {Function} Chainable command
 */
function Fetch(context, data, next, done) {
    // Merge default options with user-provided options
    const defaultOptions = {
        timeout: 30000,  // 30 seconds default timeout
        log: false       // Optional logging
    };
    const fetchOptions = { ...defaultOptions, ...data };

    // Set up timeout
    const timeoutId = setTimeout(() => {
        // If request doesn't complete within timeout, trigger an error
        const timeoutError = new Error(`Fetch request to ${this.url} timed out after ${fetchOptions.timeout}ms`);
        this.command.error(timeoutError);
        done(timeoutError);
    }, fetchOptions.timeout);

    this.request(this.name, 
        context, 
        this.getURL(this.url, context, data),
        {},  // params
        (err, context) => {
            // Clear the timeout to prevent unnecessary error
            clearTimeout(timeoutId);

            if (fetchOptions.log && !err) {
                // Log successful fetch
                this.command.log(`Successfully fetched page: ${this.url}`);
            }

            if (err === null) {
                next(context, data);
            }
            done(err);
        }
    );
}

module.exports.fetch = function(url, options = {}) {
    if (typeof url !== 'string') {
        throw new Error('URL must be a string');
    }

    this.url = url;
    
    // Merge default and user-provided options
    this.fetchOptions = {
        timeout: options.timeout || 30000,
        log: options.log || false
    };

    return Fetch;
};