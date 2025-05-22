const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    const levels = ['error', 'warn', 'info', 'debug'];
    this.logLevel = options.logLevel || 'info';
    this.logFile = options.logFile || path.join(__dirname, '../logs/scraper.log');
    this.levels = levels;
    
    // Ensure logs directory exists
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  _log(level, message, metadata = {}) {
    const currentLevelIndex = this.levels.indexOf(this.logLevel);
    const messageLevelIndex = this.levels.indexOf(level);

    // If the current log level is less than the message level, do not log
    if (currentLevelIndex < messageLevelIndex) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = JSON.stringify({
      timestamp,
      level,
      message,
      metadata
    });

    // Console output
    switch(level) {
      case 'error':
        console.error(logEntry);
        break;
      case 'warn':
        console.warn(logEntry);
        break;
      case 'info':
        console.info(logEntry);
        break;
      case 'debug':
        console.debug(logEntry);
        break;
    }

    // File logging
    try {
      // Ensure the file exists before appending
      if (!fs.existsSync(this.logFile)) {
        fs.writeFileSync(this.logFile, '');
      }
      fs.appendFileSync(this.logFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  error(message, metadata = {}) {
    this._log('error', message, metadata);
  }

  warn(message, metadata = {}) {
    this._log('warn', message, metadata);
  }

  info(message, metadata = {}) {
    this._log('info', message, metadata);
  }

  debug(message, metadata = {}) {
    this._log('debug', message, metadata);
  }
}

module.exports = Logger;