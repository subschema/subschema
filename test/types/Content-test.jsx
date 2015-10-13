var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var ValueManager = require('../../src/ValueManager');
var loader = require('../../src/loader.js');
var Text = require('../../src/types/Text.jsx');
var Content = require('../../src/types/Content.jsx');
var Editor = require('../../src/Editor');
loader.addType('Test', React.createClass({
    displayName: 'Test',
    render(){
        return <div><span>hello</span>{this.props.children}</div>
    }
}));
function into(node, debug) {
    return debug ? React.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
}

describe('Content', function () {

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

    it('should render loaded types', function () {
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
    it('should render loaded an empty p', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var more = 1;
        var vm = ValueManager({what, more});
        var content = {
            h3: 'your value is {what}', Test: {
                content: ['is more']
            }
        };
        var root = into(<Content key='t2' type='p' className='stuff' content={''} valueManager={vm} path="test"
                                 loader={loader}/>, true);
        var node = React.findDOMNode(root);
        var str = node.innerHTML;
        expect(str).toBe('');
        //expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('P');
        expect(node.className).toBe('stuff');
    });
    it('should render nested content', function () {
        var title = {

            type: 'h3',
            content: 'hello',
            className: 'panel-title clearfix'

        };

        var root = into( <Content content={title} className='panel panel-default'  valueManager={ValueManager()} loader={loader}/>, true);

        var node = React.findDOMNode(root);
        var str = node.innerHTML;
        console.log('str', str);
    });
    it('should render nested content with children', function () {
        var title = {

            type: 'h3',
            content: ['hello', {children:true}],
            className: 'panel-title clearfix'

        };

        var root = into( <Content content={title} className='panel panel-default'  valueManager={ValueManager()} loader={loader}>
                <div>What</div>

            </Content>
            , true);

        var node = React.findDOMNode(root);
        var str = node.innerHTML;
        console.log('str', str);
    });
    it('should render content stuff', function(){
        var content = [
            {
                "className": "clz-left",
                "content": [
                    {
                        "type": "h1",
                        "content": "Heading stuff"
                    },
                    {
                        "type": "p",
                        "content": "Super special content"
                    },
                    {
                        "type": "button",
                        "className": "btn btn-primary",
                        "content":"Activate"
                    }
                ]
            },
            {
                "className": "clz-right",
                "content": [
                    {
                        "type": "img",
                        "className": "super-img",
                        "src": "about:blank",
                        "content":false
                    }
                ]
            }
        ]

        var root = into( <Content content={content} className='panel panel-default'  valueManager={ValueManager()} loader={loader}>
            </Content>
            , true);

        var node = React.findDOMNode(root);
        var str = node.innerHTML;
        console.log('str', str);
    });
});