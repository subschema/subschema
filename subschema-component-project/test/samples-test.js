import React, {Component} from "react";
import generate from "../src/generate";
import {compile} from "../src/compile";
import project from "../src/templates/project/index";
import expect from "expect";
import JSZip from "jszip";
import {into, renderPage, execMock, testEachSample} from "./support";

describe('samples', function () {
    this.timeout(50000);

    describe('samples/page', function () {
        testEachSample((ds, sample) => {
            it(`should render "${sample}"`, () => {
                var blob = generate(ds, 'page', 'string');
                expect(blob).toExist();
            });

            it(`should execute "${sample}"`, () => {
                renderPage(ds, (node) => {
                    var r = into(node, true);
                    expect(r).toExist();
                });
            })
        });
    });

    describe.only('samples/project', function () {
        return testEachSample((ds, sample) => {
            it(`should create "${sample}"`, async () => {

                var blob = await generate(ds, 'project', 'zip-base64');
                expect(blob).toExist();

                var jsz = new JSZip();
                var unzip = await jsz.loadAsync(blob, {base64: true});
                expect(unzip).toExist();

                Object.keys(project).forEach((key) => {
                    expect(unzip.file(key)).toExist(`expected ${key} to Exist`);
                });

                var App = await unzip.file("public/App.jsx").async("string")
                expect(App).toExist();
                var gen = compile(App);
                expect(gen).toExist();

                var AppComponent = execMock(gen);

                expect(AppComponent).toExist('Component should be returned');
                const inst = into(<AppComponent/>, true);
                expect(inst).toExist();
                const pkgSource = await unzip.file("package.json").async("string");
                var pkg = JSON.parse(pkgSource);
                expect(pkg.name).toBe('hello');
                expect(pkg.version).toBe('0.0.1');

            });
        });
    });
});