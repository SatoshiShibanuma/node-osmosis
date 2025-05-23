const assert = require('assert');
const osmosis = require('../index');

if (typeof describe !== 'function') {
    function describe(name, testSuite) {
        console.log(`Running test suite: ${name}`);
        testSuite();
    }

    function it(testName, testFn) {
        console.log(`Running test: ${testName}`);
        testFn();
    }
}

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

    it('should support optional timeout configuration', () => {
        const instance = osmosis.fetch('https://example.com', { timeout: 5000 });
        assert.equal(typeof instance, 'function', 'Fetch with timeout did not return a chainable command');
    });

    it('should support optional logging configuration', () => {
        const instance = osmosis.fetch('https://example.com', { log: true });
        assert.equal(typeof instance, 'function', 'Fetch with log option did not return a chainable command');
    });
});