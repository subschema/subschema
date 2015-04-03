var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');

describe('form', function () {
    this.timeout(30000);
    var Form = require('subschema').Form;

    function into(node) {
//        return React.render(node, document.getElementsByTagName('body')[0]);
        return TestUtils.renderIntoDocument(node);
    }

    it('should create a form', function () {

        var root = into(<Form />);
        expect(root).toExist();
    });
    it('should create a form with a schema', function () {

        var root = into(<Form schema={{schema:{
            name:'Text'
        }}}/>);

        expect(root).toExist();
        expect(root.refs.name.refs.field).toExist();
    });
    it('should create a form with a schema and value', function () {

        var root = into(<Form value={{name:'Joe'}} schema={{schema:{
            name:'Text'
        }}}/>);

        expect(root).toExist();
        expect(root.refs.name.refs.field).toExist();
        expect(root.refs.name.refs.field.getValue()).toEqual('Joe');
        expect(root.getValue().name).toEqual('Joe');
    });

    it('should create a form with a schema and value and error', function () {
        var value = {
            name: 'Joe'
        }, schema = {
            schema: {
                name: 'Text'
            }
        }, errors = {
            name: [{message: 'Is lousy', type: 'GENERIC'}]
        };
        var root = into(<Form value={value} schema={schema} errors={errors}/>);
        expect(root.refs.name.state.errors.name[0].message).toEqual('Is lousy');
    });

    it('should create a form with a schema and value and triggered error', function () {
        var value = {}, schema = {
            schema: {
                name: {
                    type: 'Text',
                    validators: ['required']
                }
            }
        }, errors = {};

        var root = into(<Form value={value} schema={schema} errors={errors}/>);
        var node = React.findDOMNode(root.refs.name.refs.field.refs.input);
        React.addons.TestUtils.Simulate.blur(node);

        expect(root.refs.name.state.errors.name.length).toEqual(1);
        expect(root.refs.name.state.errors.name[0].message).toEqual('Required');
        expect(root.state.errors.name[0].message).toEqual('Required');
    });

})
