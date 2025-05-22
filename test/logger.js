const { Logger } = require('../lib/Logger');

describe('Logger', () => {
  let capturedLogs = [];
  const mockWriter = (message) => capturedLogs.push(message);

  beforeEach(() => {
    capturedLogs = [];
  });

  test('log messages at different levels', () => {
    const logger = new Logger({ 
      level: Logger.LEVELS.DEBUG, 
      timestamp: false,
      writer: mockWriter 
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    expect(capturedLogs.length).toBe(3);
    expect(capturedLogs[0]).toBe('[DEBUG] Debug message');
    expect(capturedLogs[1]).toBe('[INFO] Info message');
    expect(capturedLogs[2]).toBe('[WARN] Warning message');
  });

  test('respect logging levels', () => {
    const logger = new Logger({ 
      level: Logger.LEVELS.WARN, 
      timestamp: false,
      writer: mockWriter 
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    expect(capturedLogs.length).toBe(2);
    expect(capturedLogs[0]).toBe('[WARN] Warning message');
    expect(capturedLogs[1]).toBe('[ERROR] Error message');
  });

  test('support logging context', () => {
    const logger = new Logger({ 
      level: Logger.LEVELS.DEBUG, 
      timestamp: false,
      writer: mockWriter 
    });

    logger.info('Scraping page', { url: 'https://example.com', pageNumber: 1 });

    expect(capturedLogs[0]).toBe(
      '[INFO] Scraping page {"url":"https://example.com","pageNumber":1}'
    );
  });
});