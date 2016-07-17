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
const fsApi = proxyquire('../../../controllers/api/fs', stubs);
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

describe('fs delete测试', function () {

  before('before delete测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
  });

  after('after delete测试', function () {
    fs.removeSync(basePath);
  });

  beforeEach(function () {
    var app = koa();

    app.use(bodyParser);
    app.use(apiParser);
    app.use(fsApi.del);

    this.server = app.listen(8888);
  });

  afterEach(function () {
    this.server.close();
  });

  it('# 入参测试:path省略', function (done) {
    del('http://localhost:8888')
      .then(response => {
        response.message.should.equal('入参错误');
        done();
      });
  });

  it('# 入参测试:path为根目录', function (done) {
    var data = {
      path: '/'
    };

    del('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('根目录不能删除');
        done();
      });
  });

  it('# 入参测试:path不存在', function (done) {
    var data = {
      path: '/qqqqq'
    };

    del('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('路径不存在');
        done();
      });
  });

  it('# 入参测试:path安全:安全path不存在', function (done) {
    var data = {
      path: '../../../../aa'
    };

    del('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('路径不存在');
        done();
      });
  });

  it('# 入参测试:path安全:安全path为非空目录', function (done) {
    var data = {
      path: '/dir1/../../../../../../dir2'
    };

    del('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('目录非空');
        done();
      });
  });

  it('# 入参测试:path安全:安全path为文件', function (done) {
    var data = {
      path: '/dir1/../../../../../../file1.js'
    };

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists('/file1.js')) {
          done();
        }
      });
  });

  it('# 入参测试:path安全:安全path为空目录', function (done) {
    var dir = 'aaaaa',
      data = {
        path: `/dir1/../../../../../../${dir}`
      };

    fs.ensureDir(`${basePath}/${dir}`);

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists(`/${dir}`)) {
          done();
        }
      });
  });

  it('# 删除:非空目录', function (done) {
    var data = {
      path: `/dir1`
    };

    del('http://localhost:8888', data)
      .then(response => {
        response.message.should.equal('目录非空');
        done();
      });
  });

  it('# 删除:非空目录, 只存在备份和待发布文件夹', function (done) {
    var data = {
      path: `/dir1`
    };

    fs.removeSync(`${basePath}/dir1/file1.js`);
    fs.removeSync(`${basePath}/dir1/file2.js`);

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists(`/dir1`)) {
          done();
        }
      });
  });

  it('# 删除:空目录', function (done) {
    var dir = 'aaaaa',
      data = {
        path: `/${dir}`
      };

    fs.ensureDir(`${basePath}/${dir}`);

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists(`/${dir}`)) {
          done();
        }
      });
  });

  it('# 删除:文件:不包含备份&不包含待发布', function (done) {
    var data = {
      path: `/.hiddenfile1.js`
    };

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists('/.hiddenfile1.js')) {
          done();
        }
      });
  });

  it('# 删除:文件:包含备份&不包含待发布', function (done) {
    var data = {
      path: `/backup1.js`
    };

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists('/backup1.js')
          && !fsExists(`/${backupDir}/backup1.js`)) {
          done();
        }
      });
  });

  it('# 删除:文件:不包含备份&包含待发布', function (done) {
    var data = {
      path: `/deploy3.js`
    };

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists('/deploy3.js')
          && !fsExists(`/${deployDir}/deploy3.js`)) {
          done();
        }
      });
  });

  it('# 删除:文件:包含备份&包含待发布', function (done) {
    var data = {
      path: `/deploy_backup1.js`
    };

    del('http://localhost:8888', data)
      .then(() => {
        if (!fsExists('/deploy_backup1.js')
          && !fsExists(`/${deployDir}/deploy_backup1.js`)
          && !fsExists(`/${backupDir}/deploy_backup1.js`)) {
          done();
        }
      });
  });

});