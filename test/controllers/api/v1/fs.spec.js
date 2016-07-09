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
        fs.mkdirSync(basePath);
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

describe('fs move测试', function () {

    before('before move测试', function () {
        fs.mkdirSync(basePath);
        fs.mkdirSync(`${basePath}/move-one`);
        fs.mkdirSync(`${basePath}/move-two`);
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

describe('fs rename测试', function () {

    before('before rename测试', function () {
        fs.mkdirSync(basePath);
        fs.mkdirSync(`${basePath}/rename-one`);
        fs.mkdirSync(`${basePath}/rename-two`);
        fs.mkdirSync(`${basePath}/rename-three`);
    });

    after('after rename测试', function () {
        fs.removeSync(basePath);
    });

    beforeEach(function () {
        var app = koa();

        app.use(bodyParser);
        app.use(apiParser);
        app.use(fsApi.rename);

        this.server = app.listen(8888);
    });

    afterEach(function () {
        this.server.close();
    });

    it('# 重命名文件夹', function (done) {
        var data = {
            src: '/rename-one',
            name: 'one'
        };

        put('http://localhost:8888', data)
            .then(function () {
                if (fs.existsSync(path.join(basePath, '/one'))) {
                    done();
                }
            });
    });

    it('# 入参错误', function (done) {
        var data = {
            src: '/rename-one'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 路径不存在', function (done) {
        var data = {
            src: '/aaaaa',
            name: 'aa'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 文件名不合法', function (done) {
        var data = {
            src: '/rename-two',
            name: '!!'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('文件名不合法');
                done();
            });
    });

    it('# 目标名称已存在', function (done) {
        var data = {
            src: '/rename-two',
            name: 'rename-three'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('rename-three已存在');
                done();
            });
    });

});

describe('fs delete测试', function () {

    before('before delete测试', function () {
        fs.mkdirSync(basePath);
        fs.copySync(path.resolve(__dirname, '../../../files'), `${basePath}/files`);
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

    it('# 删除非空文件夹', function (done) {
        var data = {
            path: '/files'
        };

        del('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('目录非空');
                done();
            });
    });

    it('# 删除文件', function (done) {
        var p = '/files/lib/subdomain.js',
            data = {
                path: p
            };

        del('http://localhost:8888', data)
            .then(() => {
                if (!fs.existsSync(path.join(basePath, p))) {
                    done();
                }
            });
    });

    it('# 删除文件夹', function (done) {
        var p = '/files/lib',
            data = {
                path: p
            };

        del('http://localhost:8888', data)
            .then(() => {
                if (!fs.existsSync(path.join(basePath, p))) {
                    done();
                }
            });
    });

    it('# 入参错误', function (done) {
        del('http://localhost:8888')
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 路径不存在', function (done) {
        var data = {
                path: '/aa'
            };

        del('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

});