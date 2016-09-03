'use strict';

const logger = require('./logger');

module.exports = function *(next) {
  try {
    yield next;

    if (404 === this.response.status && !this.response.body) {
      this.throw(404);
    }

  } catch (error) {
    this.status = error.status || 500;

    this.app.emit('error', error, this);

    logger.error(error);

    this.render('error', {
      status: error.status
    });
  }
};