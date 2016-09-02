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
const listApi = proxyquire('../../../controllers/api/list', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const chai = require('chai');
chai.should();

describe('list测试', function () {

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
    app.use(listApi);

    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('# 入参测试:path省略', function (done) {
    // path省略,取根目录
    get(`http://localhost:8888`)
      .then(response => {
        response.data.length.should.equal(19);
        done();
      });
  });

  it('# 入参测试:path非目录', function (done) {
    var path = '/file1.js';

    get(`http://localhost:8888?path=${encodeURIComponent(path)}`)
      .then(response => {
        response.message.should.equal('目录不存在');
        done();
      });
  });

  it('# 入参测试:path安全:安全path存在', function (done) {
    var path = '../../../dir1';

    get(`http://localhost:8888?path=${encodeURIComponent(path)}`)
      .then(response => {
        response.data.length.should.equal(2);
        done();
      });
  });

  it('# 入参测试:path安全:安全path不存在', function (done) {
    var path = '../../../aaa';

    get(`http://localhost:8888?path=${encodeURIComponent(path)}`)
      .then(response => {
        response.message.should.equal('目录不存在');
        done();
      });
  });

  it('# 入参测试:path安全:安全path存在但是非目录', function (done) {
    var path = '../../../.hiddenfile1.js';

    get(`http://localhost:8888?path=${encodeURIComponent(path)}`)
      .then(response => {
        response.message.should.equal('目录不存在');
        done();
      });
  });

  it('# 入参测试:type非法', function (done) {
    var type = 'keenwon';

    // type非法,直接忽略
    get(`http://localhost:8888?type=${type}`)
      .then(response => {
        response.data.length.should.equal(19);
        done();
      });
  });

  it('# 获取列表:全部', function (done) {
    get(`http://localhost:8888`)
      .then(response => {
        response.data.length.should.equal(19);
        done();
      });
  });

  it('# 获取列表:目录,并且判断发布&备份状态', function (done) {
    var type = 'd';

    get(`http://localhost:8888?type=${type}`)
      .then(response => {
        response.data.length.should.equal(3);
        response.data.forEach(file => {
          file.hasBackup.should.equal(false);
          file.hasDeploy.should.equal(false);
        });
        done();
      });
  });

  it('# 获取列表:文件,并且判断发布&备份状态', function (done) {
    var type = 'f', hasBackup, hasDeploy,
      backupFiles = [
        'backup1.js',
        'backup2.js',
        'backup3.js',
        'deploy_backup1.js',
        'deploy_backup2.js',
        'deploy_backup3.js'
      ],
      deployFiles = [
        'deploy1.js',
        'deploy2.js',
        'deploy3.js',
        'deploy_backup1.js',
        'deploy_backup2.js',
        'deploy_backup3.js'
      ];

    get(`http://localhost:8888?type=${type}`)
      .then(response => {
        response.data.length.should.equal(16);
        response.data.forEach(file => {
          hasBackup = backupFiles.includes(file.name);
          hasDeploy = deployFiles.includes(file.name);

          if (hasBackup) {
            file.hasBackup.should.equal(true);
          } else if (hasDeploy) {
            file.hasDeploy.should.equal(true);
          } else {
            file.hasBackup.should.equal(false);
            file.hasDeploy.should.equal(false);
          }
        });
        done();
      });
  });

});