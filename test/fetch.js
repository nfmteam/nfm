'use strict';

const fetch = require('isomorphic-fetch');

module.exports = {

    post: function (url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    },

    put: function (url, data) {
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    },

    get: function (url) {
        return fetch(url).then(response => response.json());
    }

};