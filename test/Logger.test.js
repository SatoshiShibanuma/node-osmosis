const fs = require('fs');
const path = require('path');
const Logger = require('../lib/Logger');

describe('Logger', () => {
  let consoleSpy;
  let testLogFile;

  beforeEach(() => {
    // Create a unique test log file for each test
    testLogFile = path.join(process.cwd(), `test-${Date.now()}.log`);

    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
  });

  afterEach(() => {
    // Restore console methods
    consoleSpy.log.mockRestore();
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();

    // Remove test log file if it exists
    if (fs.existsSync(testLogFile)) {
      fs.unlinkSync(testLogFile);
    }
  });

  test('logPageFetch logs successful page fetch', () => {
    const logger = new Logger({ 
      level: 'info', 
      logFile: testLogFile 
    });
    const testUrl = 'https://example.com';
    
    logger.logPageFetch(testUrl, { statusCode: 200 });

    // Check console output
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      expect.objectContaining({
        url: testUrl,
        statusCode: 200
      })
    );

    // Check log file content
    const logContent = fs.readFileSync(testLogFile, 'utf-8');
    const logEntry = JSON.parse(logContent.trim());
    
    expect(logEntry).toMatchObject({
      level: 'info',
      message: `Page fetched successfully: ${testUrl}`,
      metadata: {
        url: testUrl,
        statusCode: 200
      }
    });
  });

  test('logError logs network and parsing errors', () => {
    const logger = new Logger({ 
      level: 'error', 
      logFile: testLogFile 
    });
    const testUrl = 'https://example.com';
    const testError = new Error('Connection timeout');

    logger.logError('network', testUrl, testError, { retryCount: 1 });

    // Check console output
    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR]'),
      expect.objectContaining({
        type: 'network',
        url: testUrl,
        errorMessage: 'Connection timeout',
        retryCount: 1
      })
    );

    // Check log file content
    const logContent = fs.readFileSync(testLogFile, 'utf-8');
    const logEntry = JSON.parse(logContent.trim());
    
    expect(logEntry).toMatchObject({
      level: 'error',
      message: 'NETWORK Error: Connection timeout',
      metadata: {
        type: 'network',
        url: testUrl,
        errorName: 'Error',
        errorMessage: 'Connection timeout',
        retryCount: 1
      }
    });
    expect(logEntry.metadata.stack).toBeDefined();
  });

  test('logger respects log level configuration', () => {
    const logger = new Logger({ 
      level: 'warn', 
      logFile: testLogFile 
    });

    // These should not log
    logger.debug('Debug message');
    logger.info('Info message');

    // This should log
    logger.warn('Warning message', { context: 'test' });

    // Check console output
    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.error).not.toHaveBeenCalled();
    expect(consoleSpy.warn).toHaveBeenCalledWith(
      expect.stringContaining('[WARN]'),
      { context: 'test' }
    );
  });
});
