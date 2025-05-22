const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.logLevel = options.logLevel || 'info';
    this.logFile = options.logFile || path.join(__dirname, '../logs/scraper.log');
    
    // Ensure logs directory exists
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  _log(level, message, metadata = {}) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    if (messageLevelIndex > currentLevelIndex) {
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