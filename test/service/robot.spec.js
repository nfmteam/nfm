'use strict';

const path = require('path');
const fs = require('fs-extra');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
  '../config': {
    'fs.base': basePath,
    '@global': true
  }
};
const robot = proxyquire('../../service/robot', stubs);

const chai = require('chai');
chai.should();

describe('robot 测试', function () {

  before('before robot 测试', function () {
    fs.ensureDirSync(basePath);
    fs.copySync(path.resolve(__dirname, '../files'), `${basePath}`);
  });

  after('after robot 测试', function () {
    fs.removeSync(basePath);
  });

  it('# 测试文件统计', function (done) {
    robot()
      .then(data => {
        data.totalFileCount.should.equal(22);
        data.totalDirCount.should.equal(3);
        done();
      });
  });

});