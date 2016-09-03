'use strict';

const koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const apiParser = require('../../lib/apiParser');

const chai = require('chai');
chai.should();

describe('apiParser测试', function () {

  before(function () {
    const app = koa();

    router.all('*', apiParser);
    router.get('/success', function *() {
      this.body = 'success';
    });
    router.get('/error', function *() {
      throw new Error('error');
    });

    app.use(router.routes());

    this.server = app.listen(8888);
  });

  after(function () {
    this.server.close();
  });

  it('正常测试', function (done) {
    fetch('http://localhost:8888/success')
      .then(response => response.json())
      .then(data => {
        data.should.deep.equal({
          code: 200,
          message: '',
          data: 'success'
        });
        done();
      });
  });

  it('异常测试', function (done) {
    fetch('http://localhost:8888/error')
      .then(response => response.json())
      .then(data => {
        data.should.deep.equal({
          code: 500,
          message: 'error',
          data: {}
        });
        done();
      })
  });
});