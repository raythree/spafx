import queryString from 'query-string';

import { getCurrentLocation } from './location';
import { getItem, setItem } from './storage';
import { PARAM_PREFIX, BACK_PARAM, TXN_PARAM } from './constants';

function uuid() {
  let id = "";
  for (let i = 0; i < 32; i++) {
    id += Math.floor(Math.random()*0xF).toString(0xF);
  }
  return id;
}

function validateParams(params) {
  if (!params) return;
  Object.keys(params).forEach(key => {
    if (key.startsWith(PARAM_PREFIX)) {
      throw `Parameters may not start with prefix ${PARAM_PREFIX}`;
    }
  });
}

function createLink(txn, targetUrl, params, req) {
  validateParams(params);
  if (!params) params = {};
  else params = {...params};

  params[BACK_PARAM] = req.back;
  params[TXN_PARAM] = req.txn;
  let qs = queryString.stringify(params);
  qs = (qs ? '?' + qs : '');
  const link = targetUrl + qs;

  

  return link;
}

function navigate(txn, targetUrl, params, data, state, req) {
  const link = req.link(params);

}

export function createRequest(targetUrl, backUrl) {
  if (!targetUrl) {
    throw "createRequest: targetUrl is required";
  }
  if (!backUrl) {
    backUrl = getCurrentLocation();
  }
  const txn = uuid();

  const request = {     
    txn,
    back: backUrl,
    link: function (params) {
      return createLink(txn, targetUrl, params, this);
    },
    navigate: function (params, data, state) {
      return navigate(txn, targetUrl, params, data, state, this);
    }
  };

  
  return request;
}


