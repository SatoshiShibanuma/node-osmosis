const url = require('url');

/**
 * Fetch command for retrieving web page content
 * @param {string} targetUrl - The URL to fetch
 * @param {Object} [options] - Optional configuration for fetching
 * @returns {Function} A function that can be used in the Osmosis chain
 */
module.exports = function fetch(targetUrl, options = {}) {
  // Validate URL
  if (typeof targetUrl !== 'string') {
    throw new Error('Invalid URL: URL must be a string');
  }

  // Parse and validate URL
  const parsedUrl = url.parse(targetUrl);
  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    throw new Error('Invalid URL: Must include protocol and hostname');
  }

  // Default options
  const defaultOptions = {
    timeout: 30000,  // 30 seconds default timeout
    userAgent: 'Osmosis Web Scraper',
    followRedirects: true,
    retries: 0
  };

  // Merge default options with user-provided options
  const fetchOptions = { ...defaultOptions, ...options };

  return function(context) {
    // Attach fetch method to the context
    context.fetch = async function() {
      try {
        // Utilize existing get command to maintain consistency
        const getCommand = this.get(targetUrl);
        
        // Apply additional configuration if provided
        if (fetchOptions.userAgent) {
          this.header('User-Agent', fetchOptions.userAgent);
        }

        // Set timeout if specified
        if (fetchOptions.timeout) {
          this.timeout(fetchOptions.timeout);
        }

        // Handle redirects
        if (!fetchOptions.followRedirects) {
          this.redirect(false);
        }

        return getCommand;
      } catch (error) {
        // Handle fetch errors
        if (fetchOptions.retries > 0) {
          // Implement basic retry mechanism
          fetchOptions.retries--;
          return this.fetch(targetUrl, fetchOptions);
        }
        
        // Throw or log error based on context
        throw new Error(`Fetch failed for URL ${targetUrl}: ${error.message}`);
      }
    };

    return context;
  };
};