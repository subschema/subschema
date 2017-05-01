import expect from 'expect';
import {compile, source} from  '../lib';
import fixtures from '../node_modules/subschema-test-samples/lib/index';

describe('compile', function () {
    Object.keys(fixtures).forEach((key) => {
        it(`should compile form sample "${key}" `, () => {
            var sample = fixtures[key];
            var src = source({sample: {sample}});
            var transpiled = compile(src);
            expect(transpiled.code).toExist();
        });
    });
});