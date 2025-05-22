const fs = require('fs');
const path = require('path');

/**
 * Logging levels
 * @enum {number}
 */
const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

/**
 * Logging configuration
 */
const DEFAULT_CONFIG = {
  level: LogLevel.INFO,
  logToConsole: true,
  logToFile: false,
  filePath: path.join(process.cwd(), 'osmosis.log')
};

class Logger {
  /**
   * Create a new Logger instance
   * @param {Object} [config={}] - Logging configuration
   */
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Ensure log file directory exists
    if (this.config.logToFile) {
      const logDir = path.dirname(this.config.filePath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
    
    // Log buffer for synchronous write
    this.logBuffer = [];
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @returns {string} Formatted log message
   */
  _formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  }

  /**
   * Log a message if level is permitted
   * @param {number} level - Log level
   * @param {string} levelName - Level name
   * @param {string} message - Message to log
   */
  _log(level, levelName, message) {
    if (level <= this.config.level) {
      const formattedMessage = this._formatMessage(levelName, message);

      // Log to console
      if (this.config.logToConsole) {
        switch (levelName) {
          case 'error':
            console.error(formattedMessage);
            break;
          case 'warn':
            console.warn(formattedMessage);
            break;
          case 'info':
            console.info(formattedMessage);
            break;
          case 'debug':
            console.debug(formattedMessage);
            break;
        }
      }

      // Buffer log for file writing
      if (this.config.logToFile) {
        this.logBuffer.push(formattedMessage);
        this._flushLogBuffer();
      }
    }
  }

  /**
   * Synchronously write log buffer to file
   * @private
   */
  _flushLogBuffer() {
    if (this.config.logToFile && this.logBuffer.length > 0) {
      try {
        // Synchronously append logs to file
        fs.appendFileSync(this.config.filePath, this.logBuffer.join(''));
        this.logBuffer = []; // Clear buffer after writing
      } catch (error) {
        console.error('Failed to write log file:', error);
      }
    }
  }

  /**
   * Log an error message
   * @param {string} message - Error message
   */
  error(message) {
    this._log(LogLevel.ERROR, 'error', message);
  }

  /**
   * Log a warning message
   * @param {string} message - Warning message
   */
  warn(message) {
    this._log(LogLevel.WARN, 'warn', message);
  }

  /**
   * Log an informational message
   * @param {string} message - Information message
   */
  info(message) {
    this._log(LogLevel.INFO, 'info', message);
  }

  /**
   * Log a debug message
   * @param {string} message - Debug message
   */
  debug(message) {
    this._log(LogLevel.DEBUG, 'debug', message);
  }

  /**
   * Close the log file stream and flush any remaining logs
   */
  close() {
    this._flushLogBuffer();
  }
}

// Export Logger and LogLevel for configuration
module.exports = {
  Logger,
  LogLevel
};