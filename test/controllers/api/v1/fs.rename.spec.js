'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { put } = require('../../../fetch');
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

describe('fs rename测试', function () {

    before('before rename测试', function () {
        fs.ensureDirSync(basePath);
        fs.ensureDirSync(`${basePath}/rename-one`);
        fs.ensureDirSync(`${basePath}/rename-two`);
        fs.ensureDirSync(`${basePath}/rename-three`);
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