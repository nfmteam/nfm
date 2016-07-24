'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
  '../config': {
    'fs.base': basePath,
    'backup.maxSize': 1,
    '@global': true
  }
};
const backup = proxyquire('../service/backup', stubs);

const config = require('../config');
const backupDir = config['backup.dir'];

const mocha = require('mocha');
const chai = require('chai');
chai.should();

const fsExists = p => fs.existsSync(path.join(basePath, p));
const fsReadDir = p => fs.readdirSync(path.join(basePath, p));

describe('clean backup 测试', function () {

  before('before clean backup 测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, './files'), `${basePath}`);
  });

  after('after clean backup 测试', function () {
    fs.removeSync(basePath);
  });

  it('# 清理备份1', function (done) {
    fs.removeSync(`${basePath}/backup1.js`);

    backup.clean(basePath)
      .then(() => {
        fsReadDir(backupDir).should.not.include('backup1.js');
        done();
      });
  });

  it('# 清理备份2', function (done) {
    fs.removeSync(`${basePath}/backup2.js`);

    backup.clean(basePath)
      .then(() => {
        fsReadDir(backupDir).should.not.include('backup2.js');
        done();
      });
  });

  it('# 清理备份文件:有可清理的', function (done) {
    backup.cleanFile(`${basePath}/${backupDir}/deploy_backup1.js`)
      .then(() => {
        fsReadDir(`${backupDir}/deploy_backup1.js`).should.deep.equal([
          '2.bak'
        ]);
        done();
      });
  });

  it('# 清理备份文件:没有可清理的', function (done) {
    backup.cleanFile(`${basePath}/${backupDir}/deploy_backup1.js`)
      .then(() => {
        fsReadDir(`${backupDir}/deploy_backup1.js`).should.deep.equal([
          '2.bak'
        ]);
        done();
      });
  });

});