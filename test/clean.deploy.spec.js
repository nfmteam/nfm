'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
  '../config': {
    'fs.base': basePath,
    'deploy.keepTime': 60 * 60 * 1000, // one hour
    '@global': true
  }
};
const deployer = proxyquire('../service/deployer', stubs);

const config = require('../config');
const deployDir = config['deploy.dir'];

const mocha = require('mocha');
const chai = require('chai');
chai.should();

const fsExists = p => fs.existsSync(path.join(basePath, p));
const fsReadDir = p => fs.readdirSync(path.join(basePath, p));

describe('clean deploy 测试', function () {

  before('before clean deploy 测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, './files'), `${basePath}`);
  });

  after('after clean deploy 测试', function () {
    fs.removeSync(basePath);
  });

  it('# 清理待发布文件1', function (done) {
    var targetFiles = ['deploy1.js', 'deploy2.js', 'deploy3.js'];
    var files = fsReadDir(deployDir);

    files.forEach(file => {
      if (targetFiles.includes(file)) {
        fs.utimesSync(
          `${basePath}/${deployDir}/${file}`,
          Date.now() / 1000,
          (Date.now() - 61 * 60 * 1000) / 1000
        );
      }
    });

    deployer.clean(basePath)
      .then(() => {
        fsReadDir(deployDir).should.deep.equal([
          'deploy_backup1.js',
          'deploy_backup2.js',
          'deploy_backup3.js'
        ]);
        done();
      });
  });

  it('# 清理待发布文件2', function (done) {
    var files = fsReadDir(deployDir);

    files.forEach(file => fs.utimesSync(
      `${basePath}/${deployDir}/${file}`,
      Date.now() / 1000,
      Date.now() / 1000
    ));

    deployer.clean(basePath)
      .then(() => {
        fsReadDir(deployDir).should.deep.equal([
          'deploy_backup1.js',
          'deploy_backup2.js',
          'deploy_backup3.js'
        ]);
        done();
      });
  });

});