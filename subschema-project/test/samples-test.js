import React from "react";
import {generate, compile, project} from "../lib";
import expect from "expect";
import JSZip from "jszip";
import {into, renderPage, execMock, testEachSample} from "./support";

describe('subschema-project/samples', function () {
    this.timeout(50000);

    testEachSample((ds, sample) => {
        it(`should render "${sample}"`, async () => {
            var blob = await generate(ds, 'page', 'string');
            expect(blob).toExist();
        });
    });

});