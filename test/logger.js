const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Logger = require('../lib/Logger');

describe('Logger', () => {
  const logFile = path.join(process.cwd(), 'test-osmosis.log');

  afterEach(() => {
    // Clean up log file after each test
    try {
      fs.unlinkSync(logFile);
    } catch (err) {
      // Ignore if file doesn't exist
    }
  });

  it('should create a log file when logging', () => {
    const logger = new Logger({ logFile });
    logger.info('Test log message');
    
    assert(fs.existsSync(logFile), 'Log file was not created');
  });

  it('should log messages at the correct log level', () => {
    const consoleLog = console.log;
    const consoleError = console.error;
    let loggedMessages = [];

    // Mock console methods
    console.log = console.error = (msg) => {
      loggedMessages.push(msg);
    };

    const logger = new Logger({ 
      logFile,
      logLevel: 'warn' 
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    console.log = consoleLog;
    console.error = consoleError;

    const logContent = fs.readFileSync(logFile, 'utf-8');
    
    assert(logContent.includes('Warning message'), 'Warning message should be logged');
    assert(logContent.includes('Error message'), 'Error message should be logged');
    assert(!logContent.includes('Debug message'), 'Debug message should not be logged');
    assert(!logContent.includes('Info message'), 'Info message should not be logged');
  });

  it('should include metadata in log entries', () => {
    const logger = new Logger({ logFile });
    logger.info('Test with metadata', { url: 'https://example.com', status: 200 });
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    const logEntry = JSON.parse(logContent.trim());

    assert.strictEqual(logEntry.message, 'Test with metadata');
    assert.strictEqual(logEntry.url, 'https://example.com');
    assert.strictEqual(logEntry.status, 200);
  });
});