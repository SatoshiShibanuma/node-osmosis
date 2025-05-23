const assert = require('assert');
const Logger = require('../lib/Logger');

describe('Logger Tests', () => {
  let logger;
  let originalConsole;

  beforeEach(() => {
    originalConsole = { ...console };
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
    console.debug = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
  });

  it('should log messages at or above the configured level', () => {
    logger = new Logger({ level: 'warn' });
    logger.error('Test Error');
    logger.warn('Test Warning');
    logger.info('Test Info');
    logger.debug('Test Debug');

    assert(console.error.mock.calls.length > 0, 'Error should be logged');
    assert(console.warn.mock.calls.length > 0, 'Warning should be logged');
    assert(console.info.mock.calls.length === 0, 'Info should not be logged');
    assert(console.debug.mock.calls.length === 0, 'Debug should not be logged');
  });

  it('should support optional metadata', () => {
    logger = new Logger();
    const metadata = { url: 'https://example.com', status: 404 };
    logger.error('Scraping Error', metadata);

    assert(console.error.mock.calls[0][1] === metadata, 'Metadata should be logged');
  });
});