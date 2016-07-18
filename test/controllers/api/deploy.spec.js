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
const deployApi = proxyquire('../../../controllers/api/deploy', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const config = require('../../../config');
const deployDir = config['deploy.dir'];
const backupDir = config['backup.dir'];

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

const fsExists = p => fs.existsSync(path.join(basePath, p));
const fsRead = p => fs.readFileSync(path.join(basePath, p)).toString();

describe('deploy测试', function () {

  before('before deploy测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
  });

  after('after deploy测试', function () {
    fs.removeSync(basePath);
  });

  beforeEach(function () {
    var app = koa();

    app.use(bodyParser);
    app.use(apiParser);
    app.use(deployApi.deploy);

    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('# 入参测试:path省略', function (done) {
    post('http://localhost:8888')
      .then(response => {
        response.message.should.be.equal('入参错误');
        done();
      });
  });

  it('# 入参测试:文件不存在', function (done) {
    var data = {
      path: '/aaaaaa.js'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('文件不存在');
        done();
      });
  });

  it('# 入参测试:path是目录', function (done) {
    var data = {
      path: '/dir1'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('文件不存在');
        done();
      });
  });

  it('# 入参测试:待发布文件不存在', function (done) {
    var data = {
      path: '/file1.js'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('待发布文件不存在');
        done();
      });
  });

  it('# 入参测试:path安全', function (done) {
    var data = {
      path: '/dir/../../../../aaaaa.js'
    };

    post('http://localhost:8888', data)
      .then(response => {
        response.message.should.be.equal('文件不存在');
        done();
      });
  });

  it('# 发布', function (done) {
    var data = {
      path: '/deploy1.js'
    };

    post('http://localhost:8888', data)
      .then(() => {
        if (!fsExists(`/${deployDir}/deploy1.js`) && fsExists(`/${backupDir}/deploy1.js`)) {
          var fileName = fs.readdirSync(`/${basePath}/${backupDir}/deploy1.js`)[0];
          if(fsRead(`/${backupDir}/deploy1.js/${fileName}`) === '//.nfm_deploy/deploy1.js') {
            done();
          }
        }
      });
  });

  it('# 发布', function (done) {
    var data = {
      path: '/deploy_backup1.js'
    };

    post('http://localhost:8888', data)
      .then(() => {
        if (!fsExists(`/${deployDir}/deploy_backup1.js`)
          && fsExists(`/${backupDir}/deploy_backup1.js`)
          && fs.readdirSync(`/${basePath}/${backupDir}/deploy_backup1.js`).length === 3) {
          done();
        }
      });
  });

});