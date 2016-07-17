'use strict';

const fetch = require('isomorphic-fetch');

const defaultHeaders = {
  'Content-Type': 'application/json'
};

const commonFetch = method => (url, data, headers = defaultHeaders) => fetch(url, {
  method: method === 'UPLOAD' ? 'POST' : method,
  headers: headers,
  body: method === 'UPLOAD'
    ? data
    : JSON.stringify(data)
}).then(response => response.json());

module.exports = {

  post: commonFetch('POST'),

  put: commonFetch('PUT'),

  del: commonFetch('DELETE'),

  upload: commonFetch('UPLOAD'),

  get: function (url) {
    return fetch(url).then(response => response.json());
  }

};