'use strict';

const koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const bodyParser = require('../../lib/bodyParser');
const logger = require('../../lib/logger');

const chai = require('chai');
chai.should();

describe('bodyParser测试', function () {

  afterEach(function () {
    this.server && this.server.close();
  });

  it('POST: json', function (done) {
    const app = koa();

    logger.register(app);
    app.use(logger.useGlobalLogger());

    app.use(bodyParser);

    app.use(function *() {
      this.request.body.should.be.deep.equal({
        success: true
      });
      done();
    });

    this.server = app.listen(8888);

    fetch('http://localhost:8888', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true
      })
    });
  });

  it('POST: application/x-www-form-urlencoded', function (done) {
    const app = koa();

    logger.register(app);
    app.use(logger.useGlobalLogger());

    app.use(bodyParser);

    app.use(function *() {
      this.request.body.should.be.deep.equal({
        success: 'true'
      });

      done();
    });

    this.server = app.listen(8888);

    fetch('http://localhost:8888', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'success=true'
    });
  });

  it('POST: co-body不处理的content-type', function (done) {
    const app = koa();

    logger.register(app);
    app.use(logger.useGlobalLogger());

    app.use(bodyParser);

    app.use(function *() {
      this.request.body.should.be.deep.equal({});
      done();
    });

    this.server = app.listen(8888);

    fetch('http://localhost:8888', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: JSON.stringify({
        success: true
      })
    });
  });

});