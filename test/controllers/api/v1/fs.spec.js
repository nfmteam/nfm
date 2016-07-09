'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { post, put } = require('../../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/Users/keenwon/Desktop/nfm-test';
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

before(function () {
    fs.mkdirSync(basePath);
    fs.mkdirSync(`${basePath}/move-one`);
    fs.mkdirSync(`${basePath}/move-two`);
});

after(function () {
    fs.removeSync(basePath);
});

describe('mkdir测试', function () {

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

    it('# 目录已存在', function (done) {
        var data = {
            dir: '/mkdir-test'
        };

        post('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('目录已存在');
                done();
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

describe('move测试', function () {

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