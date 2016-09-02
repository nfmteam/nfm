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
const historyApi = proxyquire('../../../controllers/api/history', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const config = require('../../../config');
const deployDir = config['deploy.dir'];
const backupDir = config['backup.dir'];

const chai = require('chai');
chai.should();

const fsExists = p => fs.existsSync(path.join(basePath, p));
const fsRead = p => fs.readFileSync(path.join(basePath, p)).toString();

describe('history restore测试', function () {

  before('before restore测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
  });

  after('after restore测试', function () {
    fs.removeSync(basePath);
  });

  beforeEach(function () {
    var app = koa();

    app.use(bodyParser);
    app.use(apiParser);
    app.use(historyApi.restore);

    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('# 入参测试:path省略', function (done) {
    var data = {
      timestamp: 1
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('入参错误');
        done();
      });
  });

  it('# 入参测试:timestamp省略', function (done) {
    var data = {
      path: 'backup1.js'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('入参错误');
        done();
      });
  });

  it('# 入参测试:path不存在', function (done) {
    var data = {
      path: 'aaaaa.js',
      timestamp: 1
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('文件不存在');
        done();
      });
  });

  it('# 入参测试:path为目录', function (done) {
    var data = {
      path: '/dir1',
      timestamp: 1
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('文件不存在');
        done();
      });
  });

  it('# 入参测试:timestamp不存在', function (done) {
    var data = {
      path: '/backup1.js',
      timestamp: 100
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('历史备份不存在');
        done();
      });
  });

  it('# 入参测试:timestamp不存在', function (done) {
    var data = {
      path: '/dir2/file1.js',
      timestamp: 1
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('历史备份不存在');
        done();
      });
  });

  it('# 入参测试:path安全', function (done) {
    var data = {
      path: '../../../../../backup1.js',
      timestamp: 1
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('');
        done();
      });
  });

  it('# 恢复', function (done) {
    var data = {
      path: '/backup1.js',
      timestamp: 1
    };

    post('http://localhost:8888', data)
      .then(() => {
        if (fsExists(`/${backupDir}/backup1.js/1.bak`)
          && fsExists(`/${backupDir}/backup1.js/2.bak`)
          && fsExists(`/${deployDir}/backup1.js`)
          && fsRead(`/${deployDir}/backup1.js`) === '//.nfm_backup/backup1.js/1.bak') {
          done();
        }
      });
  });

  it('# 恢复', function (done) {
    var data = {
      path: '/backup1.js',
      timestamp: 2
    };

    post('http://localhost:8888', data)
      .then(() => {
        if (fsExists(`/${backupDir}/backup1.js/1.bak`)
          && fsExists(`/${backupDir}/backup1.js/2.bak`)
          && fsExists(`/${deployDir}/backup1.js`)
          && fsRead(`/${deployDir}/backup1.js`) === '//.nfm_backup/backup1.js/2.bak') {
          done();
        }
      });
  });

});