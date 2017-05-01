"use strict";

var expect = require('expect');
var fix = require('subschema-test-samples').Basic;
var fs = require('fs');
var temp = require('temp');
var path = require('path');
var JSZip = require('jszip');
var spawn = require('child_process').spawn;
temp.track();
function mkdir(tmpdir, parts) {
    var dir = path.join.apply(path, [tmpdir].concat(parts));
    if (!fs.existsSync(dir)) {
        console.log('making', dir);
        fs.mkdirSync(dir);
    }
}
function npm (cmd, cwd, done){
    console.log(`running "npm ${cmd}" in ${cwd}`)
    var child = spawn('npm', [cmd], {
        cwd
    });
    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    child.on('close', (error) => {
        console.log(`npm ${cmd} process exited with code ${error}`);
        if (error !== 0) {
            return done(new Error(`Existing with error ${error}`));
        }
        done();
    });
}
describe('project', function () {
    this.timeout(600000);
    it('should generate install and test an app', function (done) {
        var generate = require('../dist/index').generate;
        expect(generate).toExist();
        var ds = {
            schema: {},
            title: 'Hello',
            demo: 'what',
            jsName: 'uhhu',
            project: {
                name: 'hello'
            },
            sample: fix
        };

        var blob = generate(ds, 'project', 'zip-base64');
        expect(blob).toExist();
        var unzip = new JSZip(blob, {base64: true});
        expect(unzip).toExist();
        temp.mkdir('subschema-project-test', function (err, dirPath) {

            if (err) {
                done(err);
            }
            console.log('tempdir', dirPath);

            Object.keys(unzip.files).forEach(function (pathName) {
                var parts = pathName.split('/');
                parts.pop();
                if (parts.length > 0) {
                    mkdir(dirPath, parts);
                }
                var content = unzip.files[pathName].asNodeBuffer();
                var dest = path.join(dirPath, pathName);
                console.log('writing', dest);
                fs.writeFileSync(dest, content);
            });
            npm('install', dirPath, function(e){
                if (e){
                    return done(e);
                }
                npm('test', dirPath, done);
            });
        });

    });
});