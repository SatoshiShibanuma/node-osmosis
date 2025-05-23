var osmosis = require('../');

describe('fetch command', function() {
  it('should fetch a URL with basic functionality', function(done) {
    var url = 'http://example.com';
    
    osmosis
      .fetch(url)
      .then(function(context) {
        assert(context.fetch, 'Fetch method should be added to context');
        done();
      })
      .error(function(err) {
        done(err);
      });
  });

  it('should throw an error for invalid URL types', function() {
    assert.throws(
      () => osmosis.fetch(123),
      /Invalid URL/,
      'Should throw error for non-string URL'
    );

    assert.throws(
      () => osmosis.fetch('invalid-url'),
      /Invalid URL/,
      'Should throw error for invalid URL format'
    );
  });

  it('should support fetch with custom options', function(done) {
    var url = 'http://example.com';
    var customOptions = {
      timeout: 10000,
      userAgent: 'Custom Test Agent',
      followRedirects: false
    };

    osmosis
      .fetch(url, customOptions)
      .then(function(context) {
        assert(context.fetch, 'Fetch method should be added to context with custom options');
        done();
      })
      .error(function(err) {
        done(err);
      });
  });
});