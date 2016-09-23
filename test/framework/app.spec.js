'use strict';

const proxyquire = require('proxyquire').noPreserveCache();
const stubs = {
  '../config': {
    'app.port': 8888,
    'fs.base': '/tmp/nfm-test',
    '@global': true
  }
};
const app = proxyquire('../../app', stubs);
const fetch = require('node-fetch');

const chai = require('chai');
chai.should();

describe('app整体性测试', function () {

  beforeEach(function () {
    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('# 首页', function (done) {
    fetch('http://localhost:8888/')
      .then(response => response.text())
      .then(html => {
        html.should.not.include('页面不存在');
        html.should.not.include('请稍后再试');
        done();
      });
  });

  it('# favicon.ico', function (done) {
    fetch('http://localhost:8888/favicon.ico')
      .then(response => {
        response.status.should.equal(200);
        response.headers.get('content-type').should.equal('image/x-icon');
        done();
      });
  });
});