var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var ValueManager = require('../../src/ValueManager');
var loader = require('../../src/loader.js');
var Text = require('../../src/types/Text.jsx');
var Content = require('../../src/types/Content.jsx');
var Editor = require('../../src/Editor');

function into(node, debug) {
    return debug ? React.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
}

describe.only('Content', function () {
    var remove;
    this.timeout(50000);

    it('should do simple subsitution', function () {
        var vm = ValueManager({test: 2});
        var root = into(<Content key='t1' content='your value is {test}' valueManager={vm} path="test"/>, true);
        var node = React.findDOMNode(root);
        var str = node.innerHTML + '';
        expect(str).toBe('your value is 2');
        expect(node.tagName).toBe('SPAN');
    });
    it('should do simple subsitution escape html in values', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var vm = ValueManager({what});
        var root = into(<Content key='t2' content='your value is {what}' valueManager={vm} path="test"/>, true);
        var node = React.findDOMNode(root);
        var str = node.innerHTML + '';
        expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('SPAN');
    });
    it('should render an array of content', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var more = 1;
        var vm = ValueManager({what, more});
        var content = ['your value is {what}', 'is more'];
        var root = into(<Content key='t2' content={content} valueManager={vm} path="test"/>, true);
        var node = React.findDOMNode(root);
        var str = node.innerHTML + '';
        //expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('SPAN');

    });
    it('should render an object of content', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var more = 1;
        var vm = ValueManager({what, more});
        var content = {h3: 'your value is {what}', div: 'is more'};
        var root = into(<Content key='t2' content={content} valueManager={vm} path="test"/>, true);
        var node = React.findDOMNode(root);
        var str = node.innerHTML + '';
        //expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('SPAN');

    });
    loader.addType('Test', React.createClass({
        displayName: 'Test',
        render(){
            return <div><span>hello</span>{this.props.children}</div>
        }
    }))
    it.only('should render loaded types', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var more = 1;
        var vm = ValueManager({what, more});
        var content = {
            h3: 'your value is {what}', Test: {
                content: ['is more']
            }
        };
        var root = into(<Content key='t2' content={content} valueManager={vm} path="test" loader={loader}/>, true);
        var node = React.findDOMNode(root);
        var str = node.innerHTML + '';
        //expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('SPAN');

    });


});