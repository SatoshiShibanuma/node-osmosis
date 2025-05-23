const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Logger = require('../lib/utils/logger');

describe('Logger', () => {
  let consoleLog, consoleInfo, consoleWarn, consoleError;
  let logFile;

  beforeEach(() => {
    // Mock console methods
    consoleLog = console.log;
    consoleInfo = console.info;
    consoleWarn = console.warn;
    consoleError = console.error;

    console.log = console.info = console.warn = console.error = () => {};

    // Create a temp log file
    logFile = path.join(__dirname, 'test-log.txt');
  });

  afterEach(() => {
    // Restore console methods
    console.log = consoleLog;
    console.info = consoleInfo;
    console.warn = consoleWarn;
    console.error = consoleError;

    // Remove temp log file
    try {
      if (fs.existsSync(logFile)) {
        fs.unlinkSync(logFile);
      }
    } catch {}
  });

  it('should create logger with default options', () => {
    const logger = new Logger();
    assert.deepStrictEqual(logger.options, {
      level: 'info',
      console: true,
      logFile: null
    });
  });

  it('should log messages at correct levels', () => {
    const logger = new Logger({ level: 'debug', logFile });

    // Capture logs
    const logs = [];
    const originalWrite = logger._writeToFile;
    logger._writeToFile = (message) => {
      logs.push(message);
      originalWrite.call(logger, message);
    };

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    assert.strictEqual(logs.length, 4);
    assert.ok(logs[0].includes('DEBUG'));
    assert.ok(logs[1].includes('INFO'));
    assert.ok(logs[2].includes('WARN'));
    assert.ok(logs[3].includes('ERROR'));
  });

  it('should respect log level filtering', () => {
    const logger = new Logger({ level: 'warn', logFile });

    // Capture logs
    const logs = [];
    const originalWrite = logger._writeToFile;
    logger._writeToFile = (message) => {
      logs.push(message);
      originalWrite.call(logger, message);
    };

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    assert.strictEqual(logs.length, 2);
    assert.ok(logs[0].includes('WARN'));
    assert.ok(logs[1].includes('ERROR'));
  });

  it('should format log messages correctly', () => {
    const logger = new Logger({ logFile });
    const metadata = { url: 'example.com', status: 200 };

    const message = logger._formatMessage('info', 'Test message', metadata);
    
    assert.ok(message.includes('[INFO]'));
    assert.ok(message.includes('Test message'));
    assert.ok(message.includes(JSON.stringify(metadata)));
  });
});