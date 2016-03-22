import React, {Component} from "react";
import expect from "expect";
import {renderToStaticMarkup} from "react-dom/server";
import {types, RenderContent, ValueManager, injector, loader, PropTypes, newSubschemaContext} from "Subschema";

const {Content} = types;


const tests = {
    '<span>your value is 2</span>': {
        key: 't1',
        path: 'test',
        content: 'your value is {test}'
    },
    '<span class="test-class" id="stuff">your value is 2</span>': {
        key: 't1', id: 'stuff', className: "test-class", content: 'your value is {test}', path: "test"
    },
    '<span id="stuff">your value is 2</span>': {
        id: 'stuff',
        dataType: 'span',
        content: {
            content: 'your value is {test}'
        }

    },
    '<div id="other" class="test-class">your value is 2</div>': {
        id: 'other',
        //this is overridden in the content
        dataType: 'span',
        content: {
            content: 'your value is {test}',
            type: 'div',
            className: "test-class"
        }
    },
    '<h2 id="other" class="test-class">your value is 2</h2>': {
        id: 'other',
        //this is not overridden in the content
        dataType: 'h2',
        content: {
            content: 'your value is {test}',
            className: "test-class"
        }
    },
    '<div id="stuff"><span>a value is 2</span><div class="test-class">your value is 2</div><span>more</span></div>': {
        id: 'stuff',
        content: {
            type: 'div',
            content: [
                'a value is {test}',
                {type: 'div', content: 'your value is {test}', className: 'test-class'},
                'more']
        }
    },
    '<span id="array"><span>more</span><span>than</span></span>': {
        id: 'array',
        content: ['more', 'than']
    },
    '<span class="panel panel-default"><span class="clz-left"><h1>Heading stuff </h1></span><span class="clz-right"><img class="super-img" src="about:blank"/></span></span>': {
        className: 'panel panel-default',
        content: [
            {
                "className": "clz-left",
                "content": [
                    {
                        "type": "h1",
                        "content": "Heading stuff {hello}"
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
    }
};

describe('components/RenderContent', function () {
    function ctx(Type, context) {
        const IType = context.injector.inject(Type);
        return class extends Component {
            static displayName = 'Context';
            static childContextTypes = PropTypes.contextTypes;

            getChildContext() {
                return context;
            }

            render() {
                const {children, ...props}= this.props;
                return <IType {...props}>{children}</IType>
            }
        }
    }

    this.timeout(50000);
    describe('tests', function () {
        Object.keys(tests).forEach(function (key) {
            const test = tests[key];
            it(`should render ${JSON.stringify(test)}`, function () {
                const valueManager = ValueManager({test: 2});
                const IContent = ctx(Content, {
                    valueManager,
                    loader,
                    injector
                });
                expect(renderToStaticMarkup(<IContent key='t1' {...test}/>)).toBe(key);
            });
        });
    });
    it('should render an content object with a mixed array of type and className and children', function () {
        const valueManager = ValueManager({test: 2});
        const IContent = ctx(Content, {
            valueManager,
            loader,
            injector
        });
        const content = {
            type: 'div',
            content: [
                'a value is {test}',
                {type: 'div', content: 'your value is {test}', className: 'test-class'},
                {
                    type: 'fieldset',
                    className: 'a-class',
                    content: [
                        {type: 'legend', content: 'I am a  legend'},
                        {
                            className: 'has-children',
                            children: true
                        },
                        {
                            type: 'footer', content: 'I am a Footer'
                        }
                    ]
                },
                'more']
        };
        const result = renderToStaticMarkup(<IContent key='t1' id='stuff' content={content}>
                <h1>See I'm Here</h1>
                <h2>Me too.</h2>
            </IContent>
        );
        expect(result).toBe('<div id="stuff"><span>a value is 2</span><div class="test-class">your value is 2</div><fieldset class="a-class"><legend>I am a  legend</legend><span class="has-children"><h1>See I&#x27;m Here</h1><h2>Me too.</h2></span><footer>I am a Footer</footer></fieldset><span>more</span></div>');
    });

    it('should render an content object with a mixed array of type and className and wrap children is true', function () {
        const valueManager = ValueManager({test: 2});
        const IContent = ctx(Content, {
            valueManager,
            loader,
            injector
        });
        const content = {
            type: 'div',
            content: [
                'a value is {test}',
                {type: 'div', content: 'your value is {test}', className: 'test-class'},
                {
                    type: 'fieldset',
                    className: 'a-class',
                    content: [
                        {type: 'legend', content: 'I am a  legend'},
                        {
                            className: 'has-children',
                            children: {
                                className: 'a-child',
                                content: ['stuff', {children: true}, 'more']
                            }
                        },
                        {
                            type: 'footer', content: 'I am a Footer'
                        }
                    ]
                },
                'more']
        };
        const result = renderToStaticMarkup(<IContent key='t1' id='stuff' content={content}>
                <h1>See I'm Here</h1>
                <h2>Me too.</h2>
            </IContent>
        );
        //@formatter:off
        /*
        <div id="stuff"><span>a value is 2</span>
            <div class="test-class">your value is 2</div>
            <fieldset class="a-class">
                <legend>I am a legend</legend>
                <span class="has-children">
                    <span class="a-child">
                        <span>stuff</span>
                        <span>
                            <h1>See I&#x27;m Here</h1>
                        </span>
                        <span>more</span>
                        </span>
                    <span class="a-child">
                        <span>stuff</span>
                        <span>
                            <h2>Me too.</h2>
                        </span>
                        <span>more</span>
                    </span>
                </span>
                <footer>I am a Footer</footer>
            </fieldset>
            <span>more</span>
        </div>
        */
        //@formatter:on
        expect(result).toBe('<div id="stuff"><span>a value is 2</span><div class="test-class">your value is 2</div><fieldset class="a-class"><legend>I am a  legend</legend><span class="has-children"><span class="a-child"><span>stuff</span><span><h1>See I&#x27;m Here</h1></span><span>more</span></span><span class="a-child"><span>stuff</span><span><h2>Me too.</h2></span><span>more</span></span></span><footer>I am a Footer</footer></fieldset><span>more</span></div>');
    });
    it('should render an content object with a mixed array of type and className and wrap children', function () {
        const valueManager = ValueManager({test: 2});
        const IContent = ctx(Content, {
            valueManager,
            loader,
            injector
        });
        const content = {
            type: 'div',
            content: [
                'a value is {test}',
                {type: 'div', content: 'your value is {test}', className: 'test-class'},
                {
                    type: 'fieldset',
                    className: 'a-class',
                    content: [
                        {type: 'legend', content: 'I am a  legend'},
                        {
                            className: 'has-children',
                            children: {
                                className: 'a-child',
                                content: ['stuff', true, 'more']
                            }
                        },
                        {
                            type: 'footer', content: 'I am a Footer'
                        }
                    ]
                },
                'more']
        };
        const result = renderToStaticMarkup(<IContent key='t1' id='stuff' content={content}>
                <h1>See I'm Here</h1>
                <h2>Me too.</h2>
            </IContent>
        );
        // @formatter:off
        /*
        <div id="stuff"><span>a value is 2</span>
            <div class="test-class">your value is 2</div>
            <fieldset class="a-class">
                <legend>I am a legend</legend>
                <span class="has-children">
                    <span class="a-child">
                        <span>stuff</span>
                        <h1>See I&#x27;m Here</h1>
                        <span>more</span>
                    </span>
                    <span class="a-child">
                        <span>stuff</span>
                        <h2>Me too.</h2>
                        <span>more</span>
                    </span>
                </span>
                <footer>I am a Footer</footer>
            </fieldset>
            <span>more</span>
        </div>
        */
        //   @formatter:on
        expect(result).toBe('<div id="stuff"><span>a value is 2</span><div class="test-class">your value is 2</div><fieldset class="a-class"><legend>I am a  legend</legend><span class="has-children"><span class="a-child"><span>stuff</span><h1>See I&#x27;m Here</h1><span>more</span></span><span class="a-child"><span>stuff</span><h2>Me too.</h2><span>more</span></span></span><footer>I am a Footer</footer></fieldset><span>more</span></div>');
    });
    it('should render an content object with a mixed array of type and className and wrap only one child', function () {
        const valueManager = ValueManager({test: 2});
        const IContent = ctx(Content, {
            valueManager,
            loader,
            injector
        });
        const content = {
            type: 'div',
            content: [
                'a value is {test}',
                {type: 'div', content: 'your value is {test}', className: 'test-class'},
                {
                    type: 'fieldset',
                    className: 'a-class',
                    content: [
                        {type: 'legend', content: 'I am a  legend'},
                        {
                            className: 'has-children',
                            children: {
                                className: 'a-child',
                                content: ['stuff', true, 'more']
                            }
                        },
                        {
                            type: 'footer', content: 'I am a Footer'
                        }
                    ]
                },
                'more']
        };
        const result = renderToStaticMarkup(<IContent key='t1' id='stuff' content={content}>
                <h2>Me too.</h2>
            </IContent>
        );
        // @formatter:off
        /*
        <div id="stuff"><span>a value is 2</span>
            <div class="test-class">your value is 2</div>
            <fieldset class="a-class">
                <legend>I am a legend</legend>
                <span class="has-children">
                    <span class="a-child">
                        <span>stuff</span>
                        <h2>Me too.</h2>
                        <span>more</span></span></span>
                <footer>I am a Footer</footer>
            </fieldset>
            <span>more</span>
        </div>
        */
        //   @formatter:on
        expect(result).toBe('<div id="stuff"><span>a value is 2</span><div class="test-class">your value is 2</div><fieldset class="a-class"><legend>I am a  legend</legend><span class="has-children"><span class="a-child"><span>stuff</span><h2>Me too.</h2><span>more</span></span></span><footer>I am a Footer</footer></fieldset><span>more</span></div>');
    });
    it('should render a list', function () {
        const valueManager = ValueManager({test: 2});
        const IContent = ctx(Content, {
            valueManager,
            loader,
            injector
        });
        const content = {
            type: 'ul',
            children: {
                type: 'li',
                className: 'list-item',
                content: [{
                    type: 'button',
                    value: 'mybutton',
                    content: 'remove'
                }, true]
            }
        };
        const result = renderToStaticMarkup(<IContent key='t1' id='stuff' content={content}>
                <div>Me too.</div>
                <span>Again</span>
            </IContent>
        );

        // @formatter:off
        //   @formatter:on
        expect(result).toBe('<ul id="stuff"><li class="list-item"><button value="mybutton">remove</button><div>Me too.</div></li><li class="list-item"><button value="mybutton">remove</button><span>Again</span></li></ul>');
    });
    it('should render a simple list', function () {
        const valueManager = ValueManager({test: 2});
        const IContent = ctx(Content, {
            valueManager,
            loader,
            injector
        });
        const result = renderToStaticMarkup(<IContent key='t1' id='stuff'
                                                      content={{children:{type:'li', children:true}}} dataType="ul">
                {['Me too.', 'Again']}
            </IContent>
        );

        // @formatter:off
        //   @formatter:on
        expect(result).toBe('<ul id="stuff"><li>Me too.</li><li>Again</li></ul>');
    });
});

/*
 <span class="panel panel-default">
 <span class="clz-left">
 <h1>Heading stuff </h1>
 <p>Super special content</p>
 <button class="btn btn-primary">Activate
 </button>
 </span>
 <span class="clz-right"></span></span>
 */