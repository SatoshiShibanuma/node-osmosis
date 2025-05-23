const assert = require('assert');
const osmosis = require('../index');

describe('Fetch Command', () => {
    it('should define a fetch method', () => {
        assert.equal(typeof osmosis.fetch, 'function', 'Fetch method is not defined');
    });

    it('should require a string URL', () => {
        assert.throws(() => {
            osmosis.fetch(123);
        }, /URL must be a string/, 'Did not throw error for non-string URL');
    });

    it('should create a chainable command', () => {
        const instance = osmosis.fetch('https://example.com');
        assert.equal(typeof instance, 'function', 'Fetch did not return a chainable command');
    });
});