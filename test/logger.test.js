const fs = require('fs');
const path = require('path');
const { Logger, LogLevel } = require('../lib/logger');

describe('Logger', () => {
  describe('Console Logging', () => {
    let originalConsoleLog;
    let originalConsoleError;
    let originalConsoleWarn;
    let originalConsoleInfo;
    let originalConsoleDebug;
    let loggedMessages;

    beforeEach(() => {
      // Store original console methods
      originalConsoleLog = console.log;
      originalConsoleError = console.error;
      originalConsoleWarn = console.warn;
      originalConsoleInfo = console.info;
      originalConsoleDebug = console.debug;

      // Setup message capture
      loggedMessages = [];
      console.log = console.error = console.warn = console.info = console.debug = (msg) => {
        loggedMessages.push(msg);
      };
    });

    afterEach(() => {
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
      console.debug = originalConsoleDebug;
    });

    test('should log messages at different levels', () => {
      const logger = new Logger({ level: LogLevel.DEBUG });
      logger.error('Error message');
      logger.warn('Warning message');
      logger.info('Info message');
      logger.debug('Debug message');

      expect(loggedMessages.length).toBe(4);
      expect(loggedMessages[0]).toContain('Error message');
      expect(loggedMessages[1]).toContain('Warning message');
      expect(loggedMessages[2]).toContain('Info message');
      expect(loggedMessages[3]).toContain('Debug message');
    });
  });

  describe('File Logging', () => {
    let logDir;
    let logFilePath;
    let logger;

    beforeEach(() => {
      logDir = path.join(process.cwd(), 'test-logs');
      
      // Ensure log directory exists
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
      }

      logFilePath = path.join(logDir, `test-${Date.now()}.log`);
      logger = new Logger({ 
        level: LogLevel.DEBUG, 
        logToConsole: false, 
        logToFile: true, 
        filePath: logFilePath 
      });
    });

    afterEach(() => {
      logger.close();
      
      // Clean up log file and directory
      if (fs.existsSync(logFilePath)) {
        fs.unlinkSync(logFilePath);
      }
      if (fs.existsSync(logDir)) {
        fs.rmdirSync(logDir);
      }
    });

    test('should write logs to file', () => {
      logger.error('Error message');
      logger.warn('Warning message');
      logger.info('Info message');
      logger.debug('Debug message');

      // Ensure file exists and has content
      expect(fs.existsSync(logFilePath)).toBe(true);
      
      const logContents = fs.readFileSync(logFilePath, 'utf8');
      expect(logContents).toContain('Error message');
      expect(logContents).toContain('Warning message');
      expect(logContents).toContain('Info message');
      expect(logContents).toContain('Debug message');
    });
  });

  describe('Log Level Configuration', () => {
    let originalConsoleLog;
    let loggedMessages;

    beforeEach(() => {
      originalConsoleLog = console.log;
      loggedMessages = [];
      console.log = console.error = console.warn = console.info = console.debug = (msg) => {
        loggedMessages.push(msg);
      };
    });

    afterEach(() => {
      console.log = originalConsoleLog;
    });

    test('should respect log level configuration', () => {
      const logger = new Logger({ level: LogLevel.WARN });
      logger.error('Error message');
      logger.warn('Warning message');
      logger.info('Info message');
      logger.debug('Debug message');

      expect(loggedMessages.length).toBe(2);
      expect(loggedMessages[0]).toContain('Error message');
      expect(loggedMessages[1]).toContain('Warning message');
    });
  });
});