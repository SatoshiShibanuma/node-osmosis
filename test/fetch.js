const assert = require('assert');
const Fetch = require('../lib/commands/fetch').Fetch;

describe('Fetch Command', function() {
  it('should throw error if no URL is provided', function() {
    const fetchCommand = new Fetch();
    assert.throws(() => {
      fetchCommand.execute({});
    }, /URL is required/);
  });

  it('should create a fetch command with default options', function() {
    const fetchCommand = new Fetch('https://example.com');
    assert.strictEqual(fetchCommand.url, 'https://example.com');
    assert.strictEqual(fetchCommand.options.timeout, 30000);
    assert.strictEqual(fetchCommand.options.retries, 3);
  });

  it('should allow custom options to override defaults', function() {
    const fetchCommand = new Fetch('https://example.com', {
      timeout: 10000,
      retries: 5
    });
    assert.strictEqual(fetchCommand.options.timeout, 10000);
    assert.strictEqual(fetchCommand.options.retries, 5);
  });
});