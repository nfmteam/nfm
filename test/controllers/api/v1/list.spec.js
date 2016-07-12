'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { get } = require('../../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
    '../lib/config': {
        'fs.base': basePath,
        '@global': true
    }
};
const listApi = proxyquire('../../../../controllers/api/v1/list', stubs);
const bodyParser = require('../../../../lib/bodyParser');
const apiParser = require('../../../../lib/apiParser');

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

describe('list测试', function () {

    before('before list测试', function () {
        fs.ensureDirSync(basePath);
        fs.copySync(path.resolve(__dirname, '../../../files'), `${basePath}/files`);
    });

    after('after list测试', function () {
        fs.removeSync(basePath);
    });

    beforeEach(function () {
        var app = koa();

        app.use(bodyParser);
        app.use(apiParser);
        app.use(listApi.getList);

        this.server = app.listen(8888);
    });

    afterEach(function () {
        this.server.close();
    });

    it('# 获取全部列表', function (done) {
        var path = '/files';

        get(`http://localhost:8888?path=${path}`)
            .then(response => {
                response.data.length.should.equal(9);
                done();
            });
    });

    it('# 获取文件列表', function (done) {
        var path = '/files/lib',
            type = 'f';

        get(`http://localhost:8888?path=${path}&type=${type}`)
            .then(response => {
                response.data.length.should.equal(1);
                done();
            });
    });

    it('# 获取文件夹列表', function (done) {
        var path = '/files',
            type = 'd';

        get(`http://localhost:8888?path=${path}&type=${type}`)
            .then(response => {
                response.data.length.should.equal(2);
                done();
            });
    });

    it('# 省略参数测试', function (done) {
        get(`http://localhost:8888`)
            .then(response => {
                response.data.length.should.equal(1);
                done();
            });
    });

    it('# 路径错误', function (done) {
        var path = '/f';

        get(`http://localhost:8888?path=${path}`)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 路径安全', function (done) {
        var path = '../../../../files',
            type = 'd';

        get(`http://localhost:8888?path=${path}&type=${type}`)
            .then(response => {
                response.data.length.should.equal(2);
                done();
            });
    });

    it('# 非法type测试', function (done) {
        var path = '/files',
            type = 'keenwon';

        get(`http://localhost:8888?path=${path}&type=${type}`)
            .then(response => {
                response.data.length.should.equal(9);
                done();
            });
    });

});