import { createRequest } from './outbound-request';

import { setMock, resetMock, parseUrl } from './location';
import { PARAM_PREFIX, BACK_PARAM, TXN_PARAM } from './constants';

describe('request tests', () => {

  afterEach(() => resetMock());

  it('should throw if targetUrl is missing', () => {
    expect(() => {
      createRequest();
    }).toThrow(/targetUrl is required/);
  });

  it('should create a request with default location', () => {
    setMock({href: '/current'});
    const request = createRequest('/spa1');
    expect(request.txn).toBeDefined();
    expect(request.back).toBe('/current')
  });

  it('should create a request with specified location', () => {
    setMock({href: '/current'});
    const request = createRequest('/spa2', '/spa1/some/path');
    expect(request.txn).toBeDefined();
    expect(request.back).toBe('/spa1/some/path')
  });

  it('should reject links with url parameters that use reserved prefix', () => {
    setMock({href: '/current?p1=one'});
    const request = createRequest('/spa2');
    expect(request.txn).toBeDefined();
    expect(request.back).toBe('/current?p1=one');

    expect(() => {
      const params = {okay: 'valid'};
      params[`${PARAM_PREFIX}_stuff`] = 'invalid';
      const link = request.link(params);
    }).toThrow(/may not start with prefix/);
  });

  it('should create links with no params', () => {
    setMock({href: '/current?p1=one'});
    const request = createRequest('/spa2');
    expect(request.txn).toBeDefined();
    expect(request.back).toBe('/current?p1=one');

    const link = request.link();
    const parsed = parseUrl(link);
    expect(parsed.path).toBe('/spa2')
    expect(parsed.fx[BACK_PARAM]).toBe('/current?p1=one')
    expect(parsed.fx[TXN_PARAM]).toBeDefined();
  });

  it('should parse urls', () => {
    let parsed = parseUrl('/some/path');
    expect(parsed.path).toBe('/some/path');
    expect(parsed.params).not.toBeDefined();

    parsed = parseUrl('/some/path?one');
    expect(parsed.path).toBe('/some/path');
    expect(parsed.params).toEqual({one: null});

    parsed = parseUrl('/some/path?one=1');
    expect(parsed.path).toBe('/some/path');
    expect(parsed.params).toEqual({one: "1"});

    parsed = parseUrl('/some/path?one=1&two=2');
    expect(parsed.path).toBe('/some/path');
    expect(parsed.params).toEqual({one: "1", two: "2"});
  });

});