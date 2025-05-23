'use strict';

const needle = require('needle');
const URL = require('url');
const libxml = require('libxmljs-dom');

/**
 * Custom Error Classes for Network Requests
 */
class NetworkRequestError extends Error {
    constructor(message, type, details = {}) {
        super(message);
        this.name = 'NetworkRequestError';
        this.type = type;
        this.details = details;
    }
}

class HttpResponseError extends NetworkRequestError {
    constructor(statusCode, statusMessage, details = {}) {
        super(`HTTP Request Failed: ${statusCode} ${statusMessage}`, 'HTTP_ERROR', {
            statusCode,
            statusMessage,
            ...details
        });
        this.name = 'HttpResponseError';
    }
}

class ParseError extends NetworkRequestError {
    constructor(message, details = {}) {
        super(message, 'PARSE_ERROR', details);
        this.name = 'ParseError';
    }
}

/**
 * Request function with enhanced error handling and retry mechanism
 *
 * @param {string} method - HTTP method
 * @param {URL} url - Request URL
 * @param {Object} params - Request parameters
 * @param {Object} opts - Request options
 * @param {number} [tries=3] - Number of retry attempts
 * @param {Function} callback - Callback function
 * @returns {Object} Needle request object
 */
function Request(method, url, params, opts, tries = 3, callback) {
    // Set default retry options if not provided
    const retryOptions = {
        ...{
            maxRetries: tries,
            retryDelay: 1000,
            retryStrategy: (err) => {
                // Retry only for network errors, not HTTP errors
                return err && (
                    err.code === 'ECONNRESET' || 
                    err.code === 'ETIMEDOUT' || 
                    err.code === 'ENOTFOUND'
                );
            }
        },
        ...opts.retryOptions
    };

    const location = url;
    let currentTry = 0;

    function makeRequest() {
        currentTry++;

        return needle.request(method, url.href, params, opts, function(err, res, data) {
            // Normalize params
            if (!(url.params instanceof Object) || url.params === null) {
                url.params = url.query;
            }

            // Network Error Handling
            if (err !== null) {
                const networkError = new NetworkRequestError(err.message, 'NETWORK_ERROR', {
                    code: err.code,
                    originalError: err,
                    url: url.href,
                    attempt: currentTry
                });

                // Retry mechanism
                if (currentTry <= retryOptions.maxRetries && 
                    retryOptions.retryStrategy(err)) {
                    setTimeout(makeRequest, retryOptions.retryDelay);
                    return;
                }

                callback(networkError);
                return;
            }

            // HTTP Error Handling
            if (opts.ignore_http_errors !== true &&
                res !== undefined &&
                res.statusCode >= 400 &&
                res.statusCode <= 500
            ) {
                const httpError = new HttpResponseError(
                    res.statusCode, 
                    res.statusMessage, 
                    { url: url.href }
                );
                callback(httpError);
                return;
            }

            // Empty Data Handling
            if (method !== 'head' && (!data || data.length === 0)) {
                const emptyDataError = new ParseError('Data is empty', { url: url.href });
                callback(emptyDataError);
                return;
            }

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

                    if (document === null) {
                        throw new ParseError('Couldn\'t parse response', { url: url.href });
                    }

                    if (document.errors[0] !== undefined && document.errors[0].code === 4) {
                        throw new ParseError('Document is empty', { url: url.href });
                    }

                    if (document.root() === null) {
                        throw new ParseError('Document has no root', { url: url.href });
                    }

                    location.headers = res.req._headers;
                    location.proxy = opts.proxy;
                    location.user_agent = opts.user_agent;

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
                    callback(parseError);
                }
            }

            if (
                opts.process_response !== undefined &&
                typeof opts.process_response === 'function'
            ) {
                if (opts.process_response.length > 2) {
                    opts.process_response(data, res, next, callback);
                    return;
                }

                next(opts.process_response(data, res));
            } else {
                next(data);
            }
        })
        .on('redirect', function(href) {
            extend(location, URL.parse(URL.resolve(location.href, href)));
        });
    }

    return makeRequest();
}

// Existing helper functions remain the same

module.exports = {
    Request,
    NetworkRequestError,
    HttpResponseError,
    ParseError
};