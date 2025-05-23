const assert = require('assert');
const fs = require('fs');
const path = require('path');
const WebPageScraper = require('../examples/basic-web-scraper');

describe('Web Page Scraper', () => {
    const testUrl = 'https://example.com';
    const outputPath = path.join(__dirname, '..', 'examples', 'scraped-content.html');

    afterEach(() => {
        // Clean up output file after each test
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }
    });

    it('should create a scraper instance', () => {
        const scraper = WebPageScraper(testUrl);
        assert.ok(scraper, 'Scraper instance not created');
        assert.equal(typeof scraper.scrape, 'function', 'Scraper missing scrape method');
    });

    it('should have default configuration', () => {
        const scraper = WebPageScraper(testUrl);
        const config = scraper.getConfig();
        
        assert.equal(config.timeout, 30000, 'Default timeout not set correctly');
        assert.equal(config.log, true, 'Default logging not enabled');
        assert.ok(config.outputFile.endsWith('scraped-content.html'), 'Default output file path incorrect');
    });

    it('should allow custom configuration', () => {
        const customOptions = {
            timeout: 10000,
            log: false,
            outputFile: './custom-output.html'
        };
        
        const scraper = WebPageScraper(testUrl, customOptions);
        const config = scraper.getConfig();
        
        assert.equal(config.timeout, 10000, 'Custom timeout not set');
        assert.equal(config.log, false, 'Custom logging setting not applied');
        assert.equal(config.outputFile, './custom-output.html', 'Custom output file path not set');
    });
});