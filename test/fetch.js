'use strict';

const assert = require('assert');
const osmosis = require('../index');

describe('Fetch Command', function() {
    it('should define a fetch method', function() {
        assert.equal(typeof osmosis.fetch, 'function', 'Fetch method is not defined');
    });

    it('should require a string URL', function() {
        assert.throws(() => {
            osmosis.fetch(123);
        }, /URL must be a string/, 'Did not throw error for non-string URL');
    });

    it('should create a chainable command', function() {
        const instance = osmosis.fetch('https://example.com');
        assert.equal(typeof instance, 'function', 'Fetch did not return a chainable command');
    });
});