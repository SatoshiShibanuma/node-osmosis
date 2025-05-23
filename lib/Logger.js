const fs = require('fs');
const path = require('path');

/**
 * Advanced logging utility for web scraping activities
 * Supports console and file-based logging with detailed error tracking
 */
class Logger {
  /**
   * Creates a new Logger instance
   * @param {Object} options - Logger configuration options
   * @param {string} [options.level='info'] - Logging level (debug, info, warn, error)
   * @param {boolean} [options.enabled=true] - Enable/disable logging
   * @param {string} [options.logFile] - Path to log file for persistent logging
   */
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.enabled = options.enabled !== false;
    this.logFile = options.logFile || path.join(process.cwd(), 'scraper.log');
    this.logLevels = ['debug', 'info', 'warn', 'error'];
  }

  /**
   * Generate a timestamp for logging
   * @returns {string} Formatted timestamp
   */
  _getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Write log message to file
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} [metadata] - Additional logging metadata
   */
  _writeToFile(level, message, metadata = {}) {
    if (!this.logFile) return;

    const logEntry = JSON.stringify({
      timestamp: this._getTimestamp(),
      level,
      message,
      metadata
    }) + '\n';

    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Check if a log level is enabled
   * @param {string} level - Log level to check
   * @returns {boolean} Whether the log level is enabled
   */
  isLevelEnabled(level) {
    const currentLevelIndex = this.logLevels.indexOf(this.level);
    const checkLevelIndex = this.logLevels.indexOf(level);
    return checkLevelIndex >= currentLevelIndex;
  }

  /**
   * Log a successful page fetch
   * @param {string} url - URL of the fetched page
   * @param {Object} [details] - Additional fetch details
   */
  logPageFetch(url, details = {}) {
    if (!this.enabled || !this.isLevelEnabled('info')) return;

    const message = `Page fetched successfully: ${url}`;
    const metadata = {
      url,
      ...details
    };

    console.log(`[INFO] ${message}`, metadata);
    this._writeToFile('info', message, metadata);
  }

  /**
   * Log a network or parsing error
   * @param {string} type - Error type (network, parsing)
   * @param {string} url - URL associated with the error
   * @param {Error} error - The error object
   * @param {Object} [details] - Additional error details
   */
  logError(type, url, error, details = {}) {
    if (!this.enabled || !this.isLevelEnabled('error')) return;

    const message = `${type.toUpperCase()} Error: ${error.message}`;
    const metadata = {
      type,
      url,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      ...details
    };

    console.error(`[ERROR] ${message}`, metadata);
    this._writeToFile('error', message, metadata);
  }

  /**
   * Debug level logging
   * @param {string} message - Log message
   * @param {Object} [metadata] - Optional additional logging metadata
   */
  debug(message, metadata = {}) {
    if (!this.enabled || !this.isLevelEnabled('debug')) return;

    console.log(`[DEBUG] ${message}`, metadata);
    this._writeToFile('debug', message, metadata);
  }

  /**
   * Info level logging
   * @param {string} message - Log message
   * @param {Object} [metadata] - Optional additional logging metadata
   */
  info(message, metadata = {}) {
    if (!this.enabled || !this.isLevelEnabled('info')) return;

    console.log(`[INFO] ${message}`, metadata);
    this._writeToFile('info', message, metadata);
  }

  /**
   * Warning level logging
   * @param {string} message - Log message
   * @param {Object} [metadata] - Optional additional logging metadata
   */
  warn(message, metadata = {}) {
    if (!this.enabled || !this.isLevelEnabled('warn')) return;

    console.warn(`[WARN] ${message}`, metadata);
    this._writeToFile('warn', message, metadata);
  }

  /**
   * Error level logging
   * @param {string} message - Log message
   * @param {Object} [metadata] - Optional additional logging metadata
   */
  error(message, metadata = {}) {
    if (!this.enabled || !this.isLevelEnabled('error')) return;

    console.error(`[ERROR] ${message}`, metadata);
    this._writeToFile('error', message, metadata);
  }
}

module.exports = Logger;