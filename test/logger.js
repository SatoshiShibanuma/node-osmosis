const assert = require('assert');
const { Logger } = require('../lib/Logger');

describe('Logger', () => {
  let capturedLogs = [];
  const mockWriter = (message) => capturedLogs.push(message);

  beforeEach(() => {
    capturedLogs = [];
  });

  it('should log messages at different levels', () => {
    const logger = new Logger({ 
      level: Logger.LEVELS.DEBUG, 
      timestamp: false,
      writer: mockWriter 
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    assert.strictEqual(capturedLogs.length, 4);
    assert.strictEqual(capturedLogs[0], '[DEBUG] Debug message');
    assert.strictEqual(capturedLogs[1], '[INFO] Info message');
    assert.strictEqual(capturedLogs[2], '[WARN] Warning message');
    assert.strictEqual(capturedLogs[3], '[ERROR] Error message');
  });

  it('should respect logging levels', () => {
    const logger = new Logger({ 
      level: Logger.LEVELS.WARN, 
      timestamp: false,
      writer: mockWriter 
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    assert.strictEqual(capturedLogs.length, 2);
    assert.strictEqual(capturedLogs[0], '[WARN] Warning message');
    assert.strictEqual(capturedLogs[1], '[ERROR] Error message');
  });

  it('should support logging context', () => {
    const logger = new Logger({ 
      level: Logger.LEVELS.DEBUG, 
      timestamp: false,
      writer: mockWriter 
    });

    logger.info('Scraping page', { url: 'https://example.com', pageNumber: 1 });

    assert.strictEqual(
      capturedLogs[0], 
      '[INFO] Scraping page {"url":"https://example.com","pageNumber":1}'
    );
  });
});