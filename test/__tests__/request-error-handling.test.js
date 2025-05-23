const { 
    Request, 
    NetworkRequestError, 
    HttpResponseError, 
    ParseError 
} = require('../../lib/Request');

describe('Network Request Error Handling', () => {
    it('should export custom error classes', () => {
        expect(NetworkRequestError).toBeDefined();
        expect(HttpResponseError).toBeDefined();
        expect(ParseError).toBeDefined();
    });

    it('HttpResponseError should contain correct properties', () => {
        const error = new HttpResponseError(404, 'Not Found', { url: 'https://example.com' });
        
        expect(error.name).toBe('HttpResponseError');
        expect(error.type).toBe('HTTP_ERROR');
        expect(error.message).toBe('HTTP Request Failed: 404 Not Found');
        expect(error.details.statusCode).toBe(404);
        expect(error.details.statusMessage).toBe('Not Found');
        expect(error.details.url).toBe('https://example.com');
    });

    it('NetworkRequestError should contain correct properties', () => {
        const error = new NetworkRequestError(
            'Connection failed', 
            'NETWORK_ERROR', 
            { code: 'ECONNREFUSED' }
        );
        
        expect(error.name).toBe('NetworkRequestError');
        expect(error.message).toBe('Connection failed');
        expect(error.type).toBe('NETWORK_ERROR');
        expect(error.details.code).toBe('ECONNREFUSED');
    });

    it('ParseError should contain correct properties', () => {
        const error = new ParseError('Document parsing failed', { url: 'https://example.com' });
        
        expect(error.name).toBe('ParseError');
        expect(error.type).toBe('PARSE_ERROR');
        expect(error.message).toBe('Document parsing failed');
        expect(error.details.url).toBe('https://example.com');
    });
});