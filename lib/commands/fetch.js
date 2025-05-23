const Command = require('../Command');

/**
 * Fetch command for retrieving web page content
 * @class
 * @extends Command
 */
class Fetch extends Command {
  /**
   * Creates a new Fetch command
   * @param {string} url - The URL to fetch
   * @param {Object} [options={}] - Optional configuration for fetching
   */
  constructor(url, options = {}) {
    super();
    this.url = url;
    this.options = {
      timeout: 30000,  // Default 30-second timeout
      retries: 3,      // Default 3 retry attempts
      ...options
    };
  }

  /**
   * Executes the fetch command
   * @param {Object} env - The current environment context
   * @returns {Promise} A promise that resolves with the fetched content
   */
  async execute(env) {
    if (!this.url) {
      throw new Error('URL is required for fetch command');
    }

    const request = env.request || require('../Request');

    try {
      const response = await this.fetchWithRetry(request, this.url, this.options);
      env.setContext(response);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch URL: ${this.url}. ${error.message}`);
    }
  }

  /**
   * Fetch URL with retry mechanism
   * @param {Object} request - The request module
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} A promise that resolves with the fetched content
   */
  async fetchWithRetry(request, url, options) {
    let lastError;

    for (let attempt = 1; attempt <= options.retries; attempt++) {
      try {
        const response = await new Promise((resolve, reject) => {
          request.get(url)
            .timeout(options.timeout)
            .end((err, res) => {
              if (err) reject(err);
              else resolve(res);
            });
        });

        return response;
      } catch (error) {
        lastError = error;
        console.warn(`Fetch attempt ${attempt} failed: ${error.message}`);
        
        // Add exponential backoff between retries
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }
}

/**
 * Export fetch command factory function
 * @param {string} url - The URL to fetch
 * @param {Object} [options={}] - Optional configuration for fetching
 * @returns {Fetch} A new Fetch command instance
 */
module.exports = function(url, options = {}) {
  return new Fetch(url, options);
};

module.exports.Fetch = Fetch;