"use strict";
import React from "react";
import expect from "expect";
import samples from "subschema-test-samples";
import {into} from "subschema-test-support";
import {ValueManager, newSubschemaContext} from "subschema";

describe('samples', function () {
    this.timeout(5000);
    if (console.time) {
        before(function () {
            console.time(ValueManager.name);
        });
        after(function () {
            console.timeEnd(ValueManager.name);
        });
    }

    Object.keys(samples).forEach(function (key) {
        const sample = samples[key];
        it(`render sample ${key} with data`, function () {
            const Subschema = newSubschemaContext();
            const {Form, loader, injector} = Subschema;
            const valueManager = ValueManager(sample.data);
            sample.setupFunc && sample.setupFunc(loader, sample.schema, Subschema, React, valueManager);

            const form = into(<Form schema={sample.schema} loader={loader} injector={injector}
                                    valueManager={valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });

        it(`render sample ${key} without data`, function () {
            const Subschema = newSubschemaContext();
            const {Form, loader, injector} = Subschema;
            const valueManager = ValueManager();
            sample.setupFunc && sample.setupFunc(loader, sample.schema, Subschema, React, valueManager);

            const form = into(<Form schema={sample.schema} loader={loader} injector={injector}
                                    valueManager={valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });

        it(`render sample ${key} with data and errors`, function () {
            const Subschema = newSubschemaContext();
            const {Form, loader, injector} = Subschema;
            const valueManager = ValueManager();
            sample.setupFunc && sample.setupFunc(loader, sample.schema, Subschema, React, valueManager);
            const form = into(<Form schema={sample.schema} loader={loader} injector={injector}
                                    valueManager={valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });
    });
});
