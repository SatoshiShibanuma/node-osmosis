const Logger = require('../lib/Logger');

describe('Logger', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();
  });

  test('should log debug message when level is debug', () => {
    const logger = new Logger({ level: 'debug' });
    logger.debug('Test debug message', { data: 'test' });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('[DEBUG]'),
      { data: 'test' }
    );
  });

  test('should not log debug message when level is info', () => {
    const logger = new Logger({ level: 'info' });
    logger.debug('Test debug message');
    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  test('should log info message', () => {
    const logger = new Logger();
    logger.info('Test info message', { data: 'test' });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      { data: 'test' }
    );
  });

  test('should log warn message', () => {
    const logger = new Logger();
    logger.warn('Test warn message', { data: 'test' });
    expect(consoleSpy.warn).toHaveBeenCalledWith(
      expect.stringContaining('[WARN]'),
      { data: 'test' }
    );
  });

  test('should log error message', () => {
    const logger = new Logger();
    logger.error('Test error message', { data: 'test' });
    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR]'),
      { data: 'test' }
    );
  });

  test('should respect log level configuration', () => {
    const logger = new Logger({ level: 'warn' });
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warn message');
    logger.error('Error message');

    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.warn).toHaveBeenCalledWith(expect.stringContaining('[WARN]'), {});
    expect(consoleSpy.error).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'), {});
  });

  test('should disable logging when enabled is false', () => {
    const logger = new Logger({ enabled: false });
    logger.info('Test message');
    expect(consoleSpy.log).not.toHaveBeenCalled();
  });
});