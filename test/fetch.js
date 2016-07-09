'use strict';

const fetch = require('isomorphic-fetch');

const commonFetch = function (url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
};

module.exports = {

    post: commonFetch,

    put: commonFetch,

    del: commonFetch,

    get: function (url) {
        return fetch(url).then(response => response.json());
    }

};