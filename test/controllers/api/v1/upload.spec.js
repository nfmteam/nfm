'use strict';

const path = require('path');
const koa = require('koa');
const router = require('koa-router')();
const fs = require('fs-extra');
const FormData = require('form-data');
const { upload } = require('../../../fetch');
const config = require('../../../../lib/config');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
    '../lib/config': {
        'fs.base': basePath,
        '@global': true
    }
};
const uploadApi = proxyquire('../../../../controllers/api/v1/upload', stubs);
const bodyParser = require('../../../../lib/bodyParser');
const apiParser = require('../../../../lib/apiParser');

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

const filesPath = path.resolve(__dirname, '../../../files');

describe('fs upload测试', function () {

    before('before upload测试', function () {
        fs.ensureDirSync(basePath);
        fs.ensureDirSync(`${basePath}/${config['upload.dir']}`);
    });

    after('after upload测试', function () {
        fs.removeSync(basePath);
    });

    beforeEach(function () {
        var app = koa();

        app.use(bodyParser);

        router.all('/api/*', apiParser);
        router.post('/api/:path', uploadApi);

        app.use(router.routes());

        this.server = app.listen(8888);
    });

    afterEach(function () {
        this.server.close();
    });

    it('# 上传文件', function (done) {
        var uploadDir = '/',
            form = new FormData(),
            headers = form.getHeaders();

        form.append('files', fs.createReadStream(`${filesPath}/README.md`));
        form.append('files', fs.createReadStream(`${filesPath}/package.json`));

        upload(`http://localhost:8888/api/${encodeURIComponent(uploadDir)}`, form, headers)
            .then(() => {
                if (fs.existsSync(path.join(basePath, 'README.md'))
                    && fs.existsSync(path.join(basePath, 'package.json'))) {
                    done();
                }
            });
    });

});