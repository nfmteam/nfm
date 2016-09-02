'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { get } = require('../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
  '../config': {
    'fs.base': basePath,
    '@global': true
  }
};
const historyApi = proxyquire('../../../controllers/api/history', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const chai = require('chai');
chai.should();

describe('history list测试', function () {

  before('before list测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
  });

  after('after list测试', function () {
    fs.removeSync(basePath);
  });

  beforeEach(function () {
    var app = koa();

    app.use(bodyParser);
    app.use(apiParser);
    app.use(historyApi.list);

    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('# 入参测试:path省略', function (done) {
    get('http://localhost:8888')
      .then(response => {
        response.message.should.be.equal('入参错误');
        done();
      });
  });

  it('# 入参测试:path为目录', function (done) {
    var p = '/dir1';

    get(`http://localhost:8888?path=${p}`)
      .then(response => {
        response.message.should.be.equal('文件不存在');
        done();
      });
  });

  it('# 入参测试:path安全:安全path存在', function (done) {
    var p = '/dir1/../../../../../backup1.js';

    get(`http://localhost:8888?path=${p}`)
      .then(response => {
        response.data.should.be.deep.equal([
          '1.bak',
          '2.bak'
        ]);
        done();
      });
  });

  it('# 入参测试:path安全:安全path不存在', function (done) {
    var p = '/dir1/../../../../../aaaaa.js';

    get(`http://localhost:8888?path=${p}`)
      .then(response => {
        response.message.should.be.equal('文件不存在');
        done();
      });
  });

  it('# 获取列表:存在备份文件1', function (done) {
    var p = '/backup1.js';

    get(`http://localhost:8888?path=${p}`)
      .then(response => {
        response.data.should.be.deep.equal([
          '1.bak',
          '2.bak'
        ]);
        done();
      });
  });

  it('# 获取列表:存在备份文件2', function (done) {
    var p = '/dir1/file1.js';

    get(`http://localhost:8888?path=${p}`)
      .then(response => {
        response.data.should.be.deep.equal([
          '1.bak'
        ]);
        done();
      });
  });

  it('# 获取列表:不存在备份文件', function (done) {
    var p = '/file1.js';

    get(`http://localhost:8888?path=${p}`)
      .then(response => {
        response.data.should.be.deep.equal([]);
        done();
      });
  });

  it('# 获取列表:不存在备份目录', function (done) {
    var p = '/file1.js';

    get(`http://localhost:8888?path=${p}`)
      .then(response => {
        response.data.should.be.deep.equal([]);
        done();
      });
  });

});