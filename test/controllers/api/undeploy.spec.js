'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { del } = require('../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
  '../config': {
    'fs.base': basePath,
    '@global': true
  }
};
const deployApi = proxyquire('../../../controllers/api/deploy', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const config = require('../../../config');
const deployDir = config['deploy.dir'];
const backupDir = config['backup.dir'];

const mocha = require('mocha');
const chai = require('chai');
chai.should();

const fsExists = p => fs.existsSync(path.join(basePath, p));

describe('undeploy测试', function () {

  before('before undeploy测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
  });

  after('after undeploy测试', function () {
    fs.removeSync(basePath);
  });

  beforeEach(function () {
    var app = koa();

    app.use(bodyParser);
    app.use(apiParser);
    app.use(deployApi.undeploy);

    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('# 入参测试:path省略', function (done) {
    del('http://localhost:8888')
      .then(response => {
        response.message.should.be.equal('入参错误');
        done();
      });
  });

  it('# 入参测试:待发布文件不存在', function (done) {
    var data = {
      path: '/file1.js'
    };

    del('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('');
        done();
      });
  });

  it('# 入参测试:path安全', function (done) {
    var data = {
      path: '/dir/../../../../aaaaa.js'
    };

    del('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('');
        done();
      });
  });

  it('# 取消发布', function (done) {
    var data = {
      path: '/deploy1.js'
    };

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists(`/${deployDir}/deploy1.js`)) {
          done();
        }
      });
  });

});