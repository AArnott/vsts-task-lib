/// <reference path="../typings/index.d.ts" />
/// <reference path="../_build/task.d.ts" />

import assert = require('assert');
import path = require('path');
import fs = require('fs');
import os = require('os');
import * as tl from '../_build/task';

import * as testutil from './testutil';

describe('Test Find File functionality', function () {

    var testPath = null;

    before(function (done) {
        try {
            testutil.initialize();
        }
        catch (err) {
            assert.fail('Failed to load task lib: ' + err.message);
        }

        testPath = path.join(testutil.getTestTemp(), 'findtest');
        tl.mkdirP(testPath);

        fs.writeFileSync(path.join(testPath, 'findTest.bat'), 'contents');
        fs.writeFileSync(path.join(testPath, 'findTest.exe'), 'contents');
        fs.writeFileSync(path.join(testPath, 'abc.exe2'), 'contents');
        fs.writeFileSync(path.join(testPath, 'abcTest.exe'), 'contents');
        done();
    });

    after(function () {
        tl.rmRF(testPath, true);
    });

    // findFiles tests
    it('findFiles() with file name pattern', function (done) {
        this.timeout(1000);

        var findResult = tl.findFiles(["*Test.*"], [], testPath);
        assert(findResult.length === 3, 'FindFiles function should return 3 results');
        done();
    });

    it('findFiles() with ext pattern search', function (done) {
        this.timeout(1000);

        var findResult = tl.findFiles(["*.exe"], [], testPath);
        console.log(findResult);
        assert(findResult.length === 2, 'FindFiles function should return 2 results');
        done();
    });

    it('findFiles() with exclude pattern search', function (done) {
        this.timeout(1000);

        var findResult = tl.findFiles(["*Test.*"], ["abc*"], testPath);
        assert(findResult.length === 2, 'FindFiles function should return 2 results');
        done();
    });

    it('findFiles() with exclude extension pattern search', function (done) {
        this.timeout(1000);

        var findResult = tl.findFiles(["**"], ["*.exe"], testPath);
        assert(findResult.length === 2, 'FindFiles function should return 2 results');
        done();
    });

    it('findFiles() with empty include pattern search', function (done) {
        this.timeout(1000);

        var findResult = tl.findFiles([], [], testPath);
        assert(findResult.length === 0, 'FindFiles function should return 0 results');
        done();
    });
});