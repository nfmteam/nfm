'use strict';

const path = require('path');
const koa = require('koa');
const router = require('koa-router')();
const fs = require('fs-extra');
const FormData = require('form-data');
const { upload } = require('../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
  '../config': {
    'fs.base': basePath,
    'upload.keepTime': 60 * 60 * 1000,
    '@global': true
  }
};
const uploader = proxyquire('../../service/uploader', stubs);
const uploadApi = proxyquire('../../controllers/api/upload', stubs);
const bodyParser = require('../../lib/bodyParser');
const apiParser = require('../../lib/apiParser');

const config = require('../../config');
const uploadDir = config['upload.dir'];

const chai = require('chai');
chai.should();

const fsReadDir = p => fs.readdirSync(path.join(basePath, p));
const fsRead = p => fs.createReadStream(path.join(__dirname, '../files', p));

// 上传,但是未成功,path不存在
function upload1() {
  var form = new FormData(),
    headers = form.getHeaders();

  form.append('path', '/aaa');
  form.append('files', fsRead('test-error.zip'));
  form.append('files', fsRead('backup1.js'));
  form.append('files', fsRead('backup2.js'));
  form.append('files', fsRead('backup3.js'));

  return upload('http://localhost:8888/api/upload', form, headers);
}

// 上传成功
function upload2() {
  var form = new FormData(),
    headers = form.getHeaders();

  form.append('path', '/dir1');
  form.append('files', fsRead('test-zip1.zip'));

  return upload('http://localhost:8888/api/upload', form, headers);
}

describe('clean upload 测试', function () {

  before('before clean upload 测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../files'), `${basePath}`);
  });

  after('after clean upload 测试', function () {
    fs.removeSync(basePath);
  });

  beforeEach(function (done) {
    var app = koa();

    app.use(bodyParser);

    router.all('*', apiParser);
    router.post('/api/upload', uploadApi);

    app.use(router.routes());

    this.server = app.listen(8888);

    Promise.all([upload1(), upload2()])
      .then(() => done());
  });

  afterEach(function () {
    fs.removeSync(`${basePath}/${uploadDir}`);
    this.server.close();
  });

  it('# 清理上传文件:清理部分文件', function (done) {
    var files = fsReadDir(uploadDir);

    for (var i = 0; i < 2; i++) {
      fs.utimesSync(
        `${basePath}/${uploadDir}/${files[i]}`,
        Date.now() / 1000,
        (Date.now() - 61 * 60 * 1000) / 1000
      );
    }

    uploader.clean()
      .then(() => {
        fsReadDir(uploadDir).length.should.equal(4);
        done();
      });
  });

  it('# 清理上传文件:无文件需清理', function (done) {
    uploader.clean()
      .then(() => {
        fsReadDir(uploadDir).length.should.equal(6);
        done();
      });
  });

  it('# 清理上传文件:全部清理', function (done) {
    var files = fsReadDir(uploadDir);

    files.forEach(file => {
      fs.utimesSync(
        `${basePath}/${uploadDir}/${file}`,
        Date.now() / 1000,
        (Date.now() - 61 * 60 * 1000) / 1000
      );
    });

    uploader.clean()
      .then(() => {
        fsReadDir(uploadDir).length.should.equal(0);
        done();
      });
  });

  it('# 清理上传文件:上传文件夹不存在', function (done) {
    fs.removeSync(`${basePath}/${uploadDir}`);

    uploader.clean()
      .then(() => {
        done();
      });
  });

});