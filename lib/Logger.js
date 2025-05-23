const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.logLevel = options.logLevel || 'info';
    this.logFile = options.logFile || path.join(process.cwd(), 'osmosis.log');
    this.logLevels = ['error', 'warn', 'info', 'debug'];
  }

  _shouldLog(level) {
    return this.logLevels.indexOf(level) <= this.logLevels.indexOf(this.logLevel);
  }

  _log(level, message, metadata = {}) {
    if (!this._shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const logEntry = JSON.stringify({
      timestamp,
      level,
      message,
      ...metadata
    }) + '\n';

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
      fs.appendFileSync(this.logFile, logEntry);
    } catch (err) {
      console.error('Failed to write to log file:', err);
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