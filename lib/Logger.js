/**
 * Logging utility for Osmosis web scraper
 * Provides configurable logging with different log levels
 */
class Logger {
  /**
   * Creates a new Logger instance
   * @param {Object} options - Logger configuration options
   * @param {string} [options.level='info'] - Logging level (debug, info, warn, error)
   * @param {boolean} [options.enabled=true] - Enable/disable logging
   */
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.enabled = options.enabled !== false;
    this.logLevels = ['debug', 'info', 'warn', 'error'];
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
   * Debug level logging
   * @param {string} message - Log message
   * @param {Object} [metadata] - Optional additional logging metadata
   */
  debug(message, metadata = {}) {
    if (this.enabled && this.isLevelEnabled('debug')) {
      console.log(`[DEBUG] ${message}`, metadata);
    }
  }

  /**
   * Info level logging
   * @param {string} message - Log message
   * @param {Object} [metadata] - Optional additional logging metadata
   */
  info(message, metadata = {}) {
    if (this.enabled && this.isLevelEnabled('info')) {
      console.log(`[INFO] ${message}`, metadata);
    }
  }

  /**
   * Warning level logging
   * @param {string} message - Log message
   * @param {Object} [metadata] - Optional additional logging metadata
   */
  warn(message, metadata = {}) {
    if (this.enabled && this.isLevelEnabled('warn')) {
      console.warn(`[WARN] ${message}`, metadata);
    }
  }

  /**
   * Error level logging
   * @param {string} message - Log message
   * @param {Object} [metadata] - Optional additional logging metadata
   */
  error(message, metadata = {}) {
    if (this.enabled && this.isLevelEnabled('error')) {
      console.error(`[ERROR] ${message}`, metadata);
    }
  }
}

module.exports = Logger;