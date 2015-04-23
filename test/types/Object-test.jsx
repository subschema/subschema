describe('Object', function () {
    var React = require('react/addons');
    var TestUtils = require('react/lib/ReactTestUtils');
    var expect = require('expect');
    var subschema = require('../../src/index')
    var Form = subschema.Form;
    var loader = subschema.loader;
    var Simulate = React.addons.TestUtils.Simulate;
    var sample = require('../../public/samples/Loader.jsx');
    var _ = require('lodash');
    this.timeout(50000);
    function into(node) {
        return TestUtils.renderIntoDocument(node);
//        return React.render(node, document.getElementsByTagName('body')[0]);
    }

    var load;
    beforeEach(function () {
        load = sample.setup(subschema);
    });
    afterEach(function () {
        loader.removeLoader(load);
    });
    it('should render a registered schema', function () {
        var setup = sample.setup(subschema);
        var schema = sample.schema, data = sample.data;
        var root = into(<Form schema={schema} value={data}/>);
        expect(root).toExist();
    });

})