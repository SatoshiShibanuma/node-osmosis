const test = require('tape');
const osmosis = require('../');

test('fetch command basic functionality', (t) => {
  t.plan(4);

  const testUrl = 'http://example.com';

  osmosis
    .fetch(testUrl)
    .then(function(context) {
      t.ok(context.fetch, 'Fetch method should be added to context');
      t.pass('Fetch command can be chained');
    })
    .error(function(err) {
      t.fail('Should not encounter an error: ' + err);
    });

  t.throws(
    () => osmosis.fetch(123),
    /Invalid URL/,
    'Should throw error for non-string URL'
  );

  t.throws(
    () => osmosis.fetch('invalid-url'),
    /Invalid URL/,
    'Should throw error for invalid URL format'
  );
});

test('fetch command with options', (t) => {
  t.plan(2);

  const testUrl = 'http://example.com';
  const customOptions = {
    timeout: 10000,
    userAgent: 'Custom Test Agent',
    followRedirects: false
  };

  osmosis
    .fetch(testUrl, customOptions)
    .then(function(context) {
      t.ok(context.fetch, 'Fetch method should be added to context with custom options');
      t.pass('Fetch command can be chained with custom options');
    })
    .error(function(err) {
      t.fail('Should not encounter an error: ' + err);
    });
});