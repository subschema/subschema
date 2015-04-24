var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var Subschema = require('subschema')
var Form = Subschema.Form;
var loader = Subschema.loader;
var sample = require('../../public/samples/Loader.jsx');

describe('Object', function () {

    function into(node) {
        return TestUtils.renderIntoDocument(node);
//        return React.render(node, document.getElementsByTagName('body')[0]);
    }

    var load;
    beforeEach(function () {
        load = sample.setup(Subschema);
    });
    afterEach(function () {
        loader.removeLoader(load);
    });
    it('should render a registered schema', function () {
        var schema = sample.schema, data = sample.data;
        var root = into(<Form schema={schema} value={data}/>);
        expect(root).toExist();
    });

})