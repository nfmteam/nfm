'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { post } = require('../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
  '../config': {
    'fs.base': basePath,
    '@global': true
  }
};
const fsApi = proxyquire('../../../controllers/api/fs', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const config = require('../../../config');
const deployDir = config['deploy.dir'];
const backupDir = config['backup.dir'];
const uploadDir = config['upload.dir'];

const chai = require('chai');
chai.should();

const fsExists = p => fs.existsSync(path.join(basePath, p));

describe('fs mkdir测试', function () {

  before('before mkdir测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
  });

  after('after mkdir测试', function () {
    fs.removeSync(basePath);
  });

  beforeEach(function () {
    var app = koa();

    app.use(bodyParser);
    app.use(apiParser);
    app.use(fsApi.mkdir);

    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('入参错误:dir省略', function (done) {
    post('http://localhost:8888')
      .then(response => {
        response.message.should.equal('入参错误');
        done();
      });
  });

  it('入参错误:dir安全:安全dir不存在', function (done) {
    var data = {
      dir: '/dir3/../../../../../../../aaaaa'
    };

    post('http://localhost:8888', data)
      .then(() => {
        if (fsExists('/aaaaa')) {
          done();
        }
      });
  });

  it('入参错误:dir安全:安全dir存在,是目录', function (done) {
    var data = {
      dir: '../../../../../../../dir1'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('');
        done();
      });
  });

  it('入参错误:dir安全:安全dir存在,是文件', function (done) {
    var data = {
      dir: '../../../../../../../file1.js'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('路径已存在');
        done();
      });
  });

  it('入参错误:文件名不合法:包含非法字符', function (done) {
    var data = {
      dir: '/测试'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('文件名不合法');
        done();
      });
  });

  it('入参错误:文件名不合法:包含nfm系统文件夹', function (done) {
    var data = {
      dir: `/${uploadDir}`
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('文件名不合法');
        done();
      });
  });

  it('入参错误:父级路径不存在', function (done) {
    var data = {
      dir: '/cc/bbbb'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('路径不存在');
        done();
      });
  });

  it('创建文件夹', function (done) {
    var data = {
      dir: '/dir1/abcde'
    };

    post('http://localhost:8888', data)
      .then(() => {
        if (fsExists('/dir1/abcde')
          && fsExists(`/dir1/abcde/${deployDir}`)
          && fsExists(`/dir1/abcde/${backupDir}`)) {
          done();
        }
      });
  });

});