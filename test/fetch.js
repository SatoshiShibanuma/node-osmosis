const Osmosis = require('../index');
const assert = require('assert');

module.exports = function(done) {
  const fetch = Osmosis.fetch('https://example.com', {
    timeout: 10000,
    retries: 3
  });

  assert(fetch, 'Fetch command should be created');
  assert.strictEqual(fetch.url, 'https://example.com', 'URL should match input');
  assert.strictEqual(fetch.options.timeout, 10000, 'Timeout should be configurable');
  assert.strictEqual(fetch.options.retries, 3, 'Retries should be configurable');

  done();
};