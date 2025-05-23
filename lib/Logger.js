/**
 * Custom Logger for Osmosis Web Scraping
 * Provides structured logging with multiple log levels and configurable outputs
 */
class Logger {
  /**
   * Create a new Logger instance
   * @param {Object} options - Logger configuration options
   * @param {string} [options.level='info'] - Minimum log level to output
   * @param {boolean} [options.timestamp=true] - Include timestamp in log messages
   * @param {boolean} [options.colorize=true] - Colorize log output
   */
  constructor(options = {}) {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    this.options = {
      level: options.level || 'info',
      timestamp: options.timestamp !== false,
      colorize: options.colorize !== false
    };
  }

  /**
   * Generate a formatted timestamp
   * @returns {string} Formatted timestamp
   * @private
   */
  _getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Determine if a log should be output based on current log level
   * @param {string} messageLevel - Level of the log message
   * @returns {boolean} Whether the message should be logged
   * @private
   */
  _shouldLog(messageLevel) {
    return this.levels[messageLevel] <= this.levels[this.options.level];
  }

  /**
   * Color-code log messages
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @returns {string} Colored log message
   * @private
   */
  _colorize(level, message) {
    if (!this.options.colorize) return message;

    const colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m',  // Yellow
      info: '\x1b[36m',  // Cyan
      debug: '\x1b[90m'  // Gray
    };
    const reset = '\x1b[0m';
    return `${colors[level]}${message}${reset}`;
  }

  /**
   * Core logging method
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} [metadata] - Additional log metadata
   */
  _log(level, message, metadata = {}) {
    if (!this._shouldLog(level)) return;

    const timestamp = this.options.timestamp ? `[${this._getTimestamp()}] ` : '';
    const logMessage = `${timestamp}[${level.toUpperCase()}] ${message}`;
    const coloredMessage = this._colorize(level, logMessage);

    switch (level) {
      case 'error':
        console.error(coloredMessage, metadata);
        break;
      case 'warn':
        console.warn(coloredMessage, metadata);
        break;
      case 'info':
        console.info(coloredMessage, metadata);
        break;
      case 'debug':
        console.debug(coloredMessage, metadata);
        break;
    }
  }

  /**
   * Log an error message
   * @param {string} message - Error message
   * @param {Object} [metadata] - Error metadata
   */
  error(message, metadata = {}) {
    this._log('error', message, metadata);
  }

  /**
   * Log a warning message
   * @param {string} message - Warning message
   * @param {Object} [metadata] - Warning metadata
   */
  warn(message, metadata = {}) {
    this._log('warn', message, metadata);
  }

  /**
   * Log an informational message
   * @param {string} message - Information message
   * @param {Object} [metadata] - Info metadata
   */
  info(message, metadata = {}) {
    this._log('info', message, metadata);
  }

  /**
   * Log a debug message
   * @param {string} message - Debug message
   * @param {Object} [metadata] - Debug metadata
   */
  debug(message, metadata = {}) {
    this._log('debug', message, metadata);
  }
}

module.exports = Logger;