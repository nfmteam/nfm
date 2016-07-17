'use strict';

const logger = require('./logger');

const defaultResponse = {
  code: 200,
  message: '',
  data: {}
};

const apiSuccess = (data = {}) => Object.assign({}, defaultResponse, {
  data: data
});

const apiError = (message = 'error') => Object.assign({}, defaultResponse, {
  code: 500,
  message: message
});

function *apiParser(next) {
  try {
    yield next;
    this.body = apiSuccess(this.body);
  } catch (error) {
    logger.error(error);

    this.status = 200;
    this.body = apiError(error.message);
  }
}

module.exports = apiParser;