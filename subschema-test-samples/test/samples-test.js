import React from "react";
import expect from "expect";
import samples from "subschema-test-samples";
import {into} from "subschema-test-support";
import {newSubschemaContext, ValueManager} from "subschema";

describe('samples', function () {
    this.timeout(5000);


    Object.keys(samples).forEach(function (key) {
        const sample = samples[key];
        it(`render sample ${key} with data`, function () {
            const Subschema = newSubschemaContext();
            const {Form} = Subschema;
            Subschema.valueManager = ValueManager(sample.data);
            sample.setupFunc && sample.setupFunc(Subschema.importer, sample.schema);

            const form = into(<Form schema={sample.schema} loader={Subschema.loader} injector={Subschema.injector}
                                    valueManager={Subschema.valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });

        it(`render sample ${key} without data`, function () {
            const Subschema = newSubschemaContext();
            const {Form} = Subschema;
            sample.setupFunc && sample.setupFunc(Subschema.importer, sample.schema);
            const form = into(<Form schema={sample.schema} loader={Subschema.loader} injector={Subschema.injector}
                                    valueManager={Subschema.valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });

        it(`render sample ${key} with data and errors`, function () {
            const Subschema = newSubschemaContext();
            const {Form} = Subschema;
            sample.setupFunc && sample.setupFunc(Subschema.importer, sample.schema);
            const form = into(<Form schema={sample.schema} loader={Subschema.loader} injector={Subschema.injector}
                                    valueManager={Subschema.valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });
    });
});
