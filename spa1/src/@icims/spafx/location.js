import queryString from 'query-string';
import { PARAM_PREFIX, BACK_PARAM, TXN_PARAM, RES_PARAM, VOID_PARAM } from './constants';

let location = window.location;

export function isRequest(fxParams) {
  if (fxParams[BACK_PARAM]) {
    // must not have RES or VOID, and must have TXN param
    if (!fxParams[TXN_PARAM]) {
      throw "request missing transaction parameter";
    }
    if (typeof fxParams[VOID_PARAM] !== "undefined") {
      throw "requests must not have void return parameters";
    }
    if (typeof fxParams[RES_PARAM] !== "undefined") {
      throw "requests must not have void return result parameters";
    }
    return true;
  } 
  else {
    return false;
  }
}

export function isResponse(fxParams) {
  if (fxParams[RES_PARAM] || typeof fxParams[VOID_PARAM] !== "undefined") {
    // must not have RES or VOID, and must have TXN param
    if (!fxParams[TXN_PARAM]) {
      throw "request missing transaction parameter";
    }
    if (typeof fxParams[VOID_PARAM] !== "undefined") {
      throw "requests must not have void return parameters";
    }
    if (typeof fxParams[RES_PARAM] !== "undefined") {
      throw "requests must not have void return result parameters";
    }
    return true;
  } 
  else {
    return false;
  }
}

// separate into query params and base URL
export function parseUrl(url) {
  const ix = url.indexOf('?');
  if (ix < 0) return {path: url}; 
  const path = url.substring(0, ix);
  const qs = url.substring(ix);
  const allParams = queryString.parse(qs);
  const params = {};
  const fx = {}
  Object.keys(allParams).forEach(k => {
    if (k.indexOf(PARAM_PREFIX) === 0) {
      fx[k] = allParams[k];
    }
    else {
      params[k] = allParams[k];
    }
  });
  return {path, params, fx};
}

// For tests, allow the global location to be mocked
export function setMock(locationMock) {
  location = locationMock;
}
export function resetMock() {
  location = window.location;
}

export function getCurrentLocation() {
  return location.href;
}


