/**
 * Logging utility for web scraping activities
 * Provides a flexible, configurable logging mechanism
 */
class Logger {
  /**
   * Creates a new Logger instance
   * @param {Object} [options={}] - Logging configuration options
   * @param {string} [options.level='info'] - Logging level
   * @param {boolean} [options.console=true] - Enable console logging
   * @param {string} [options.logFile=null] - Path to log file
   */
  constructor(options = {}) {
    this.options = {
      level: options.level || 'info',
      console: options.console !== false,
      logFile: options.logFile || null
    };

    // Log levels in order of severity
    this.logLevels = ['debug', 'info', 'warn', 'error'];
  }

  /**
   * Check if a log should be output based on current log level
   * @param {string} level - Log level to check
   * @returns {boolean} Whether log should be output
   */
  _shouldLog(level) {
    const currentLevelIndex = this.logLevels.indexOf(this.options.level);
    const messageLevelIndex = this.logLevels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Create a formatted log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} [metadata={}] - Additional log metadata
   * @returns {string} Formatted log message
   */
  _formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const metadataStr = Object.keys(metadata).length 
      ? ` | ${JSON.stringify(metadata)}` 
      : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metadataStr}`;
  }

  /**
   * Log a debug message
   * @param {string} message - Debug message
   * @param {Object} [metadata={}] - Additional debug metadata
   */
  debug(message, metadata = {}) {
    if (this._shouldLog('debug')) {
      const formattedMessage = this._formatMessage('debug', message, metadata);
      if (this.options.console) {
        console.log(formattedMessage);
      }
      this._writeToFile(formattedMessage);
    }
  }

  /**
   * Log an info message
   * @param {string} message - Info message
   * @param {Object} [metadata={}] - Additional info metadata
   */
  info(message, metadata = {}) {
    if (this._shouldLog('info')) {
      const formattedMessage = this._formatMessage('info', message, metadata);
      if (this.options.console) {
        console.info(formattedMessage);
      }
      this._writeToFile(formattedMessage);
    }
  }

  /**
   * Log a warning message
   * @param {string} message - Warning message
   * @param {Object} [metadata={}] - Additional warning metadata
   */
  warn(message, metadata = {}) {
    if (this._shouldLog('warn')) {
      const formattedMessage = this._formatMessage('warn', message, metadata);
      if (this.options.console) {
        console.warn(formattedMessage);
      }
      this._writeToFile(formattedMessage);
    }
  }

  /**
   * Log an error message
   * @param {string} message - Error message
   * @param {Object} [metadata={}] - Additional error metadata
   */
  error(message, metadata = {}) {
    if (this._shouldLog('error')) {
      const formattedMessage = this._formatMessage('error', message, metadata);
      if (this.options.console) {
        console.error(formattedMessage);
      }
      this._writeToFile(formattedMessage);
    }
  }

  /**
   * Write log message to file (if configured)
   * @param {string} message - Formatted log message
   * @private
   */
  _writeToFile(message) {
    if (this.options.logFile) {
      try {
        const fs = require('fs');
        fs.appendFileSync(this.options.logFile, message + '\n', 'utf8');
      } catch (err) {
        console.error('Failed to write to log file:', err);
      }
    }
  }
}

module.exports = Logger;