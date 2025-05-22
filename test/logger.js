const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Logger = require('../lib/logger');

describe('Logger', () => {
  const logFile = path.join(__dirname, '../logs/test-scraper.log');

  beforeEach(() => {
    // Clear log file before each test
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }
  });

  it('should create log file if it does not exist', () => {
    const logger = new Logger({ logFile });
    logger.info('Test log');
    assert(fs.existsSync(logFile), 'Log file was not created');
  });

  it('should log messages at correct levels', () => {
    const logger = new Logger({ logLevel: 'info', logFile });
    
    const originalConsoleInfo = console.info;
    let loggedMessage = null;
    console.info = (msg) => { loggedMessage = msg; };

    logger.info('Info message', { data: 'test' });
    
    console.info = originalConsoleInfo;
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    const logEntry = JSON.parse(logContent.trim());
    
    assert.strictEqual(logEntry.level, 'info');
    assert.strictEqual(logEntry.message, 'Info message');
    assert.deepStrictEqual(logEntry.metadata, { data: 'test' });
  });

  it('should not log messages above configured log level', () => {
    const logger = new Logger({ logLevel: 'error', logFile });
    
    const originalConsoleInfo = console.info;
    let loggedMessage = null;
    console.info = (msg) => { loggedMessage = msg; };

    logger.info('Info message');
    
    console.info = originalConsoleInfo;
    
    const logContent = fs.readFileSync(logFile, 'utf-8').trim();
    assert.strictEqual(logContent, '');
  });
});