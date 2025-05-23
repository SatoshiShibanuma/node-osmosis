const assert = require('assert');
const Logger = require('../lib/Logger');

describe('Logger', () => {
  let logger;
  let originalConsole;

  beforeEach(() => {
    // Capture console methods
    originalConsole = { ...console };
    console.error = console.warn = console.info = console.debug = jest.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
  });

  describe('Log Level Configuration', () => {
    it('should not log messages below configured level', () => {
      logger = new Logger({ level: 'warn' });
      logger.info('Test Info Message');
      logger.debug('Test Debug Message');

      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('should log messages at or above configured level', () => {
      logger = new Logger({ level: 'warn' });
      logger.warn('Test Warning');
      logger.error('Test Error');

      expect(console.warn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Log Methods', () => {
    beforeEach(() => {
      logger = new Logger({ timestamp: false, colorize: false });
    });

    it('should call correct console method for each log level', () => {
      logger.error('Error Message');
      logger.warn('Warning Message');
      logger.info('Info Message');
      logger.debug('Debug Message');

      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('ERROR'), {});
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('WARN'), {});
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('INFO'), {});
      expect(console.debug).toHaveBeenCalledWith(expect.stringContaining('DEBUG'), {});
    });

    it('should support metadata with log messages', () => {
      const metadata = { url: 'https://example.com', status: 404 };
      logger.error('Scraping Error', metadata);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR'),
        metadata
      );
    });
  });

  describe('Optional Features', () => {
    it('should support disabling timestamp', () => {
      logger = new Logger({ timestamp: false });
      logger.info('No Timestamp');

      const consoleCall = console.info.mock.calls[0][0];
      expect(consoleCall).not.toMatch(/^\[\d{4}-\d{2}-\d{2}/);
    });

    it('should support disabling colorization', () => {
      logger = new Logger({ colorize: false });
      logger.info('Uncolored Message');

      const consoleCall = console.info.mock.calls[0][0];
      expect(consoleCall).not.toMatch(/\x1b/);
    });
  });
});