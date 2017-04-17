import React from "react";
import generate from "../src/generate";
import {compile} from "../src/compile";
import project from "../src/templates/project/index";
import expect from "expect";
import JSZip from "jszip";
import {into, renderPage, execMock, testEachSample} from "./support";

describe('samples', function () {
    this.timeout(50000);

    describe('samples/page', function () {
        testEachSample((ds, sample)=> {
            it(`should render "${sample}"`, ()=> {
                var blob = generate(ds, 'page', 'string');
                expect(blob).toExist();
            });

            it(`should execute "${sample}"`, ()=> {
                renderPage(ds, (node)=> {
                    var r = into(node, true);
                    expect(r).toExist();
                });
            })
        });
    });

    describe('samples/project', function () {
        testEachSample((ds, sample)=> {
            it(`should create "${sample}"`, ()=> {

                var blob = generate(ds, 'project', 'zip-base64');
                expect(blob).toExist();

                var unzip = new JSZip(blob, {base64: true});
                expect(unzip).toExist();

                Object.keys(project).forEach((key)=> {
                    expect(unzip.file(key)).toExist(`expected ${key} to Exist`);
                });

                var App = unzip.file("public/App.jsx").asText();
                expect(App).toExist();

                var gen = compile(App);
                expect(gen).toExist();

                var Component = execMock(gen);
                expect(Component).toExist('Component should be returned');

                var pkg = JSON.parse(unzip.file("package.json").asText());
                expect(pkg.name).toBe('hello');
                expect(pkg.version).toBe('0.0.1');

            });
        });
    });
});