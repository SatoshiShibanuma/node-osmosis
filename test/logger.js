const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Logger, LogLevel } = require('../lib/logger');

describe('Logger', () => {
  let logFilePath;
  let logger;

  beforeEach(() => {
    // Create a unique log file for each test
    logFilePath = path.join(process.cwd(), `test-${Date.now()}.log`);
  });

  afterEach(() => {
    // Clean up log file if it exists
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
    }
  });

  it('should log messages to console', () => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;
    const originalConsoleDebug = console.debug;

    let loggedMessages = [];

    console.log = console.error = console.warn = console.info = console.debug = (msg) => {
      loggedMessages.push(msg);
    };

    logger = new Logger({ level: LogLevel.DEBUG });
    logger.error('Error message');
    logger.warn('Warning message');
    logger.info('Info message');
    logger.debug('Debug message');

    assert.strictEqual(loggedMessages.length, 4);
    assert.ok(loggedMessages[0].includes('Error message'));
    assert.ok(loggedMessages[1].includes('Warning message'));
    assert.ok(loggedMessages[2].includes('Info message'));
    assert.ok(loggedMessages[3].includes('Debug message'));

    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.info = originalConsoleInfo;
    console.debug = originalConsoleDebug;
  });

  it('should log messages to file', () => {
    logger = new Logger({ 
      level: LogLevel.DEBUG, 
      logToConsole: false, 
      logToFile: true, 
      filePath: logFilePath 
    });

    logger.error('Error message');
    logger.warn('Warning message');
    logger.info('Info message');
    logger.debug('Debug message');

    logger.close();

    const logContents = fs.readFileSync(logFilePath, 'utf8');
    assert.ok(logContents.includes('Error message'));
    assert.ok(logContents.includes('Warning message'));
    assert.ok(logContents.includes('Info message'));
    assert.ok(logContents.includes('Debug message'));
  });

  it('should respect log level configuration', () => {
    const originalConsoleLog = console.log;
    let loggedMessages = [];

    console.log = console.error = console.warn = console.info = console.debug = (msg) => {
      loggedMessages.push(msg);
    };

    // Set log level to WARN, should only log WARN and ERROR
    logger = new Logger({ level: LogLevel.WARN });
    logger.error('Error message');
    logger.warn('Warning message');
    logger.info('Info message');
    logger.debug('Debug message');

    assert.strictEqual(loggedMessages.length, 2);
    assert.ok(loggedMessages[0].includes('Error message'));
    assert.ok(loggedMessages[1].includes('Warning message'));

    // Restore original console methods
    console.log = originalConsoleLog;
  });
});