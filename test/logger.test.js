import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import Logger from '../lib/Logger.js';

describe('Logger', () => {
  const logFile = path.join(process.cwd(), 'test-osmosis.log');

  afterEach(() => {
    // Clean up log file after each test
    try {
      fs.unlinkSync(logFile);
    } catch (err) {
      // Ignore if file doesn't exist
    }
  });

  it('should create a log file when logging', () => {
    const logger = new Logger({ logFile });
    logger.info('Test log message');
    
    expect(fs.existsSync(logFile)).toBe(true);
  });

  it('should log messages at the correct log level', () => {
    const consoleLog = console.log;
    const consoleError = console.error;
    let loggedMessages = [];

    // Mock console methods
    console.log = console.error = (msg) => {
      loggedMessages.push(msg);
    };

    const logger = new Logger({ 
      logFile,
      logLevel: 'warn' 
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    console.log = consoleLog;
    console.error = consoleError;

    const logContent = fs.readFileSync(logFile, 'utf-8');
    
    expect(logContent).toContain('Warning message');
    expect(logContent).toContain('Error message');
    expect(logContent).not.toContain('Debug message');
    expect(logContent).not.toContain('Info message');
  });

  it('should include metadata in log entries', () => {
    const logger = new Logger({ logFile });
    logger.info('Test with metadata', { url: 'https://example.com', status: 200 });
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    const logEntry = JSON.parse(logContent.trim());

    expect(logEntry.message).toBe('Test with metadata');
    expect(logEntry.url).toBe('https://example.com');
    expect(logEntry.status).toBe(200);
  });
});