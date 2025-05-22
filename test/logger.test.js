const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Logger, LogLevel } = require('../lib/logger');

// Create a custom test runner
function runTests() {
  const tests = [
    function testLogToConsole() {
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      const originalConsoleInfo = console.info;
      const originalConsoleDebug = console.debug;

      let loggedMessages = [];

      console.log = console.error = console.warn = console.info = console.debug = (msg) => {
        loggedMessages.push(msg);
      };

      const logger = new Logger({ level: LogLevel.DEBUG });
      logger.error('Error message');
      logger.warn('Warning message');
      logger.info('Info message');
      logger.debug('Debug message');

      assert.strictEqual(loggedMessages.length, 4, 'Should log 4 messages');
      assert.ok(loggedMessages[0].includes('Error message'), 'Error message should be logged');
      assert.ok(loggedMessages[1].includes('Warning message'), 'Warning message should be logged');
      assert.ok(loggedMessages[2].includes('Info message'), 'Info message should be logged');
      assert.ok(loggedMessages[3].includes('Debug message'), 'Debug message should be logged');

      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
      console.debug = originalConsoleDebug;

      console.log('testLogToConsole passed');
    },

    function testLogToFile() {
      const logFilePath = path.join(process.cwd(), `test-${Date.now()}.log`);
      const logger = new Logger({ 
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
      assert.ok(logContents.includes('Error message'), 'Error message should be in log file');
      assert.ok(logContents.includes('Warning message'), 'Warning message should be in log file');
      assert.ok(logContents.includes('Info message'), 'Info message should be in log file');
      assert.ok(logContents.includes('Debug message'), 'Debug message should be in log file');

      // Clean up log file
      fs.unlinkSync(logFilePath);

      console.log('testLogToFile passed');
    },

    function testLogLevelConfiguration() {
      const originalConsoleLog = console.log;
      let loggedMessages = [];

      console.log = console.error = console.warn = console.info = console.debug = (msg) => {
        loggedMessages.push(msg);
      };

      // Set log level to WARN, should only log WARN and ERROR
      const logger = new Logger({ level: LogLevel.WARN });
      logger.error('Error message');
      logger.warn('Warning message');
      logger.info('Info message');
      logger.debug('Debug message');

      assert.strictEqual(loggedMessages.length, 2, 'Should only log 2 messages at WARN level');
      assert.ok(loggedMessages[0].includes('Error message'), 'Error message should be logged');
      assert.ok(loggedMessages[1].includes('Warning message'), 'Warning message should be logged');

      // Restore original console methods
      console.log = originalConsoleLog;

      console.log('testLogLevelConfiguration passed');
    }
  ];

  // Run tests
  tests.forEach(test => {
    try {
      test();
    } catch (error) {
      console.error(`Test failed: ${test.name}`);
      console.error(error);
      process.exit(1);
    }
  });

  console.log('All tests passed!');
}

// Run the tests
runTests();