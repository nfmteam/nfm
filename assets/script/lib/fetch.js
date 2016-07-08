import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';

const checkResponseStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
};

const checkDataStatus = response => {
    if (response.code === 200) {
        return response.data;
    } else {
        throw response.message;
    }
};

const send = (method, url, body) => Promise.all([
    fetch(url, {
        credentials: 'same-origin',
        method: method,
        body: body
    }).then(checkResponseStatus).then(checkDataStatus),
    Promise.delay(500)
]).then(([data]) => data);

export default send;