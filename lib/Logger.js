/**
 * Custom Logger for Osmosis Web Scraping
 * Provides flexible logging mechanisms with configurable levels
 */
class Logger {
  /**
   * Logging levels from most verbose to least
   * @enum {number}
   */
  static LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    SILENT: 4
  };

  /**
   * Create a new Logger instance
   * @param {Object} options - Logger configuration
   * @param {number} [options.level=1] - Logging level
   * @param {boolean} [options.timestamp=true] - Include timestamp in logs
   * @param {function} [options.writer=console.log] - Custom log writer
   */
  constructor(options = {}) {
    this.level = options.level || Logger.LEVELS.INFO;
    this.timestamp = options.timestamp !== false;
    this.writer = options.writer || console.log;
  }

  /**
   * Generate log message with optional timestamp
   * @param {string} level - Log level name
   * @param {string} message - Log message
   * @param {Object} [context] - Additional logging context
   * @returns {string} Formatted log message
   * @private
   */
  _formatMessage(level, message, context = {}) {
    const timestamp = this.timestamp ? `[${new Date().toISOString()}] ` : '';
    const contextStr = Object.keys(context).length > 0 
      ? ` ${JSON.stringify(context)}` 
      : '';
    return `${timestamp}[${level}] ${message}${contextStr}`;
  }

  /**
   * Log a debug message
   * @param {string} message - Debug message
   * @param {Object} [context] - Additional context
   */
  debug(message, context) {
    if (this.level <= Logger.LEVELS.DEBUG) {
      this.writer(this._formatMessage('DEBUG', message, context));
    }
  }

  /**
   * Log an informational message
   * @param {string} message - Info message
   * @param {Object} [context] - Additional context
   */
  info(message, context) {
    if (this.level <= Logger.LEVELS.INFO) {
      this.writer(this._formatMessage('INFO', message, context));
    }
  }

  /**
   * Log a warning message
   * @param {string} message - Warning message
   * @param {Object} [context] - Additional context
   */
  warn(message, context) {
    if (this.level <= Logger.LEVELS.WARN) {
      this.writer(this._formatMessage('WARN', message, context));
    }
  }

  /**
   * Log an error message
   * @param {string} message - Error message
   * @param {Object} [context] - Additional context
   */
  error(message, context) {
    if (this.level <= Logger.LEVELS.ERROR) {
      this.writer(this._formatMessage('ERROR', message, context));
    }
  }
}

// Export as a singleton to ensure consistent logging across the library
module.exports = new Logger();
module.exports.Logger = Logger;