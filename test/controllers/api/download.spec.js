'use strict';

const fs = require('fs-extra');
const path = require('path');
const koa = require('koa');
const { get, fetch } = require('../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
  '../config': {
    'fs.base': basePath,
    '@global': true
  }
};
const downloadApi = proxyquire('../../../controllers/api/download', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const chai = require('chai');
chai.should();

describe('download测试', function () {

  before('before download测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
  });

  after('after download测试', function () {
    fs.removeSync(basePath);
  });

  beforeEach(function () {
    var app = koa();

    app.use(bodyParser);
    app.use(apiParser);
    app.use(downloadApi);

    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('# 入参测试:path不存在', function (done) {
    get('http://localhost:8888')
      .then(response => {
        response.message.should.be.equal('入参错误');
        done();
      });
  });

  it('# 文件下载:文件不存在', function (done) {
    get('http://localhost:8888?path=asdf.js')
      .then(response => {
        response.message.should.be.equal('文件不存在');
        done();
      });
  });

  it('# 文件下载:文件存在', function (done) {
    fetch('http://localhost:8888?path=file1.js')
      .then(response => {
        response.status.should.equal(200);
        response.headers.get('content-disposition').should.not.empty;
        done();
      });
  });

});