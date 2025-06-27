import { getEndpoint } from './api';

describe('API Utility Functions', () => {
  it('should correctly construct an API endpoint for a simple path', () => {
    const path = 'users';
    const expectedUrl = 'http://192.168.1.186:3000/api/users';
    expect(getEndpoint(path)).toBe(expectedUrl);
  });

  it('should correctly construct an API endpoint for a path with a leading slash', () => {
    const path = '/products';
    const expectedUrl = 'http://192.168.1.186:3000/api/products';
    expect(getEndpoint(path)).toBe(expectedUrl);
  });

  it('should handle empty path', () => {
    const path = '';
    const expectedUrl = 'http://192.168.1.186:3000/api/';
    expect(getEndpoint(path)).toBe(expectedUrl);
  });
});