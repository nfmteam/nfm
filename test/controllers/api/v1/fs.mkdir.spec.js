'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { put, post, del } = require('../../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
    '../lib/config': {
        'fs.base': basePath,
        '@global': true
    }
};
const fsApi = proxyquire('../../../../controllers/api/v1/fs', stubs);
const bodyParser = require('../../../../lib/bodyParser');
const apiParser = require('../../../../lib/apiParser');

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

describe('fs mkdir测试', function () {

    before('before mkdir测试', function () {
        fs.ensureDirSync(basePath);
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

    it('# 创建文件夹1', function (done) {
        var dir = '/mkdir-test',
            data = {
                dir: dir
            };

        post('http://localhost:8888', data)
            .then(function () {
                if (fs.existsSync(path.join(basePath, dir))) {
                    done();
                }
            });
    });

    it('# 创建文件夹2', function (done) {
        var dir = '/mkdir-test/test',
            data = {
                dir: dir
            };

        post('http://localhost:8888', data)
            .then(function () {
                if (fs.existsSync(path.join(basePath, dir))) {
                    done();
                }
            });
    });

    it('# 入参错误', function (done) {
        post('http://localhost:8888')
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 路径不存在', function (done) {
        var data = {
            dir: '/one/two'
        };

        post('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 文件名不合法', function (done) {
        var data = {
            dir: '/!!'
        };

        post('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('文件名不合法');
                done();
            });
    });

});