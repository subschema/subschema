import {React,findNode, intoWithContext,context,TestUtils,expect, Simulate} from 'subschema-test-support';
import ReactServer from 'react-dom/server';
import {ValueManager, loader, types, Editor,Form} from 'Subschema';

const { Content} = types;

describe('Content', function () {
    before(function () {
        loader.addType('Test', React.createClass({
            displayName: 'Test',
            render(){
                return <div><span>hello</span>{this.props.children}</div>
            }
        }));
    });

    it('should do simple subsitution', function () {
        var valueManager = ValueManager({test: 2});
        var root = intoWithContext(<Content key='t1' content='your value is {test}' path="test"/>, {
            valueManager,
            loader
        });
        var node = findNode(root);
        var str = node.innerHTML + '';
        expect(str).toBe('your value is 2');
        expect(node.tagName).toBe('SPAN');
    });
    it('should do simple subsitution escape html in values', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var valueManager = ValueManager({what});
        var root = intoWithContext(<Content key='t2' content='your value is {what}' path="test"/>, {
            valueManager,
            loader
        });
        var node = findNode(root);
        var str = node.innerHTML + '';
        expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('SPAN');
    });
    it('should render an array of content', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var more = 1;
        var valueManager = ValueManager({what, more});
        var content = ['your value is {what}', 'is more'];
        var root = intoWithContext(<Content key='t2' content={content} path="test"/>, {valueManager, loader});
        var node = findNode(root);
        var str = node.innerHTML + '';
        //expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('SPAN');

    });
    it('should render an object of content', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var more = 1;
        var valueManager = ValueManager({what, more});
        var content = {h3: 'your value is {what}', div: 'is more'};
        var root = intoWithContext(<Content key='t2' content={content} path="test"/>, {valueManager, loader});
        var node = findNode(root);
        var str = node.innerHTML + '';
        //expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('SPAN');

    });

    it('should render loaded types', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var more = 1;
        var valueManager = ValueManager({what, more});
        var content = {
            h3: 'your value is {what}', Test: {
                content: ['is more']
            }
        };
        var root = intoWithContext(<Content key='t2' content={content} path="test"/>, {valueManager, loader});
        var node = findNode(root);
        var str = node.innerHTML + '';
        //expect(str).toBe('your value is &lt;h1&gt;2&lt;/h1&gt;');
        expect(node.tagName).toBe('SPAN');

    });
    it('should render loaded an h3', function () {
        var what = '<' + 'h1' + '>2<' + '/h1>';
        var more = 1;
        var valueManager = ValueManager({what, more});

        var root = intoWithContext(<Content key='t2' type='p' className='stuff' content={''}
                                            path="test"/>, {valueManager, loader});
        var node = findNode(root);
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

        var root = intoWithContext(<Content content={title} className='panel panel-default'/>, {
            loader,
            valueManager: ValueManager()
        });

        var node = findNode(root);
    });
    it('should render nested content with children', function () {
        var title = {

            type: 'h3',
            content: ['hello', {children: true}],
            className: 'panel-title clearfix'

        };

        var root = intoWithContext(<Content content={title} className='panel panel-default'>
                <div>What</div>
            </Content>, {loader, valueManager: ValueManager()}
        );

        var node = findNode(root);
        var str = node.innerHTML;
    });
    it('should render content stuff', function () {
        var content = [
            {
                "className": "clz-left",
                "content": [
                    {
                        "type": "h1",
                        "content": "Heading stuff {hello}"
                    },
                    {
                        "type": "p",
                        "content": "Super special content"
                    },
                    {
                        "type": "button",
                        "className": "btn btn-primary",
                        "content": "Activate"
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
                        "content": false
                    }
                ]
            }
        ]
        var valueManager = ValueManager({hello: 'Joe'});
        var Context = context({valueManager, loader});
        var node = ReactServer.renderToStaticMarkup(<Context><Content content={content} className='panel panel-default'
            /></Context>);

        expect(node).toEqual('<span class="panel panel-default" type="span">' +
            '<span class="clz-left" type="span">' +
            '<span class="clz-left">Heading stuff Joe</span>' +
            '<span class="clz-left">Super special content</span>' +
            '<span class="clz-left">Activate</span>' +
            '</span>' +
            '<span class="clz-right" type="span">' +
            '<img type="img" class="super-img" src="about:blank" content="false"/>' +
            '</span>' +
            '</span>');
    });
    it('should render content stuff in a form', function () {
        var content = [
            {
                "className": "clz-left",
                "content": [
                    {
                        "type": "h1",
                        "content": "Heading stuff {hello}"
                    },
                    {
                        "type": "p",
                        "content": "Super special content"
                    },
                    {
                        "type": "button",
                        "className": "btn btn-primary",
                        "content": "Activate"
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
                        "content": false
                    }
                ]
            }
        ];
        var schema = {
            schema: {
                'test': {
                    type: "Content",
                    template: false,
                    title: false,
                    content
                }
            }
        }

        var form = TestUtils.renderIntoDocument(<Form schema={schema} valueManager={ValueManager({hello:'Joe'})}
                                                      loader={loader}/>);
        var node = findNode(TestUtils.scryRenderedComponentsWithType(form, Content)[0]);
        var str = node.innerHTML.replace(/\s?data-reactid=\"[^"]*\"/g, '').replace(/\s+?/g, ' ');

        /*  expect(str).toEqual('<span type="span"><span  type="span">' +
         '<span class="clz-left" type="span">' +
         '<span class="clz-left">Heading stuff Joe</span>' +
         '<span class="clz-left">Super special content</span>' +
         '<span class="clz-left">Activate</span>' +
         '</span>' +
         '<span class="clz-right" type="span">' +
         '<img type="img" class="super-img" src="about:blank" content="false">' +
         '</span>' +
         '</span></span>');
         */
//        '<span class="clz-left" type="span"><span class="clz-left">Heading stuff Joe</span><span class="clz-left">Super special content</span><span class="clz-left">Activate</span></span><span class="clz-right" type="span"><img type="img" class="super-img" src="about:blank" content="false"></span>'
        //       '<span class="clz-left" type="span"><span class="clz-left">Heading stuff Joe</span><span class="clz-left">Super special content</span><span class="clz-left">Activate</span></span><span class="clz-right" type="span"><img type="img" class="super-img" src="about:blank" content="false"></span>'

    });
});