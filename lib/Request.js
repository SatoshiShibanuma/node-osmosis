'use strict';

const needle = require('needle');
const URL = require('url');
const libxml = require('libxmljs-dom');

/**
 * Enhanced HTTP Request with improved configuration and error handling
 *
 * @param {string} method - HTTP method (get, post, etc.)
 * @param {URL} url - URL object representing the target URL
 * @param {Object} params - Request parameters
 * @param {Object} opts - Additional request options
 * @param {number} tries - Number of retry attempts
 * @param {Function} callback - Callback function for request completion
 * @returns {Object} Needle request object
 */
function Request(method, url, params, opts, tries, callback) {
    // Default configuration
    const defaultOpts = {
        timeout: 30000,  // 30 seconds
        max_retries: 3,  // Maximum retry attempts
        retry_delay: 1000, // Delay between retries in milliseconds
        ignore_http_errors: false,
        parse: true,
        keep_data: false
    };

    // Merge default options with provided options
    opts = { ...defaultOpts, ...opts };
    
    const location = url;

    function handleRequest(currentTry = 1) {
        return needle.request(
            method,
            url.href,
            params,
            opts,
            (err, res, data) => {
                // Handle network errors
                if (err) {
                    if (currentTry < opts.max_retries) {
                        setTimeout(() => {
                            handleRequest(currentTry + 1);
                        }, opts.retry_delay);
                        return;
                    }
                    callback(`Network Error: ${err.message}`);
                    return;
                }

                // HTTP Error Handling
                if (!opts.ignore_http_errors && 
                    res && 
                    res.statusCode >= 400 && 
                    res.statusCode < 600
                ) {
                    if (currentTry < opts.max_retries) {
                        setTimeout(() => {
                            handleRequest(currentTry + 1);
                        }, opts.retry_delay);
                        return;
                    }
                    callback(`HTTP Error: ${res.statusCode} ${res.statusMessage}`);
                    return;
                }

                // Empty data check
                if (method !== 'head' && (!data || data.length === 0)) {
                    callback('Error: Received empty data');
                    return;
                }

                processResponse(res, data, location, opts, callback);
            }
        )
        .on('redirect', (href) => {
            extend(location, URL.parse(URL.resolve(location.href, href)));
        });
    }

    return handleRequest();
}

/**
 * Process and parse the HTTP response
 * 
 * @param {Object} res - HTTP response object
 * @param {Buffer|string} data - Response data
 * @param {URL} location - Original request URL
 * @param {Object} opts - Request options
 * @param {Function} callback - Callback function
 */
function processResponse(res, data, location, opts, callback) {
    function next(document) {
        if (opts.parse === false) {
            callback(null, res, document);
            return;
        }

        try {
            document = libxml.parseHtml(document, { 
                baseUrl: location.href, 
                huge: true 
            });

            if (!document) {
                callback('Error: Could not parse response');
                return;
            }

            if (document.errors[0] && document.errors[0].code === 4) {
                callback('Error: Document is empty');
                return;
            }

            if (!document.root()) {
                callback('Error: Document has no root');
                return;
            }

            // Attach metadata
            document.location = location;
            document.request = location;

            setResponseMeta(document, res, data.length);
            setCookies(document, res.cookies);
            setCookies(document, opts.cookies);

            if (opts.keep_data === true) {
                document.response.data = data;
            }

            callback(null, res, document);
        } catch (parseError) {
            callback(`Parse Error: ${parseError.message}`);
        }
    }

    // Custom response processing
    if (opts.process_response && typeof opts.process_response === 'function') {
        if (opts.process_response.length > 2) {
            opts.process_response(data, res, next, callback);
            return;
        }
        next(opts.process_response(data, res));
    } else {
        next(data);
    }
}

// Existing utility functions remain the same
function setResponseMeta(document, res, size) { /* ... */ }
function getResponseType(contentType) { /* ... */ }
function setCookies(document, cookies) { /* ... */ }
function extend(object, donor) { /* ... */ }

module.exports = Request;