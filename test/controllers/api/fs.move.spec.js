'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { put } = require('../../fetch');
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

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

describe('fs move测试', function () {

    before('before move测试', function () {
        fs.ensureDirSync(basePath);
        fs.ensureDirSync(`${basePath}/move-one`);
        fs.ensureDirSync(`${basePath}/move-two`);
    });

    after('after move测试', function () {
        fs.removeSync(basePath);
    });

    beforeEach(function () {
        var app = koa();

        app.use(bodyParser);
        app.use(apiParser);
        app.use(fsApi.move);

        this.server = app.listen(8888);
    });

    afterEach(function () {
        this.server.close();
    });

    it('# 移动文件夹1', function (done) {
        var data = {
            src: '/move-one',
            dest: '/move-two'
        };

        put('http://localhost:8888', data)
            .then(function () {
                if (fs.existsSync(path.join(basePath, '/move-two/move-one'))) {
                    done();
                }
            });
    });

    it('# 移动文件夹2', function (done) {
        var data = {
            src: '/move-two/move-one',
            dest: '/'
        };

        put('http://localhost:8888', data)
            .then(function () {
                var path1 = path.join(basePath, '/move-one');
                var path2 = path.join(basePath, '/move-two');
                if (fs.existsSync(path1) && fs.existsSync(path2)) {
                    done();
                }
            });
    });

    it('# 入参错误1', function (done) {
        var data = {
            src: '/move-one'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 入参错误2', function (done) {
        var data = {
            dest: '/move-one'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 路径不存在1', function (done) {
        var data = {
            src: '/move-one',
            dest: '/two'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 路径不存在2', function (done) {
        var data = {
            src: '/one',
            dest: '/move-two'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

});