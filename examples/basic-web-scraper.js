#!/usr/bin/env node

'use strict';

const osmosis = require('../index');
const fs = require('fs');
const path = require('path');

/**
 * Basic Web Page Scraper
 * Demonstrates Osmosis web page fetching with logging and error handling
 */
function WebPageScraper(url, options = {}) {
    // Default options
    const defaultOptions = {
        timeout: 30000,  // 30 seconds
        outputFile: path.join(__dirname, 'scraped-content.html'),
        log: true
    };
    
    // Merge default and user options
    const config = { ...defaultOptions, ...options };

    // Create a function to log messages
    const logger = (message) => {
        if (config.log) {
            console.log(`[WebPageScraper] ${message}`);
        }
    };

    // Main scraping function
    const scrape = () => {
        logger(`Starting scrape of URL: ${url}`);

        osmosis
            .get(url)
            .config({
                timeout: config.timeout
            })
            .then((context) => {
                // Extract HTML content
                const htmlContent = context.document.toString();
                
                // Log successful fetch
                logger('Successfully retrieved webpage content');

                // Optional: Save to file
                try {
                    fs.writeFileSync(config.outputFile, htmlContent);
                    logger(`Saved content to ${config.outputFile}`);
                } catch (error) {
                    logger(`Error saving file: ${error.message}`);
                }

                return htmlContent;
            })
            .error((err) => {
                logger(`Scraping error: ${err.message}`);
                process.exit(1);
            })
            .done(() => {
                logger('Scraping process completed');
            });
    };

    return {
        scrape,
        getConfig: () => config
    };
}

// Example usage if script is run directly
if (require.main === module) {
    const url = process.argv[2] || 'https://example.com';
    const scraper = WebPageScraper(url);
    scraper.scrape();
}

module.exports = WebPageScraper;