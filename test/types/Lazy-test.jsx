var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var ValueManager = require('../../src/ValueManager');
var loader = require('../../src/loader.js');
var Text = require('../../src/types/Text.jsx');
var Editor = require('../../src/Editor');

function into(node, debug) {
    return debug ? React.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
}

describe('Lazy', function () {
    var remove;
    before(function () {
        remove = loader.addLoader({
            loadType(type){
                if (type == 'Text') {
                    return new Promise((resolve, reject) => {
                        setTimeout(()=> {
                            resolve(Text);
                        }, 1000);
                    });
                }
            }
        });

    });

    after(function () {
        loader.removeLoader(remove);
    });

    it('should create a lazy type', function (done) {
        var vm = ValueManager({test: 2});

        var root = into(<Editor loader={loader} valueManager={vm} field={{type:'Text', title:'hello', template:false}}
                                path="test"/>, true);

        var input = React.findDOMNode(TestUtils.scryRenderedDOMComponentsWithTag(root, 'span')[0]);
        expect(input.classList.contains('lazy-loading-type')).toBe(true);
        setTimeout(function () {
            expect(TestUtils.scryRenderedDOMComponentsWithTag(root, 'span')[0]).toNotExist();
            var text = TestUtils.scryRenderedComponentsWithType(root, Text)[0];
            expect(text).toExist();
            expect(React.findDOMNode(text).value).toBe('2');
            done();
        }, 1200);
    });

});