import {React, into,TestUtils,expect, Simulate} from 'subschema-test-support';
import {ValueManager, loader, Editor, types} from 'Subschema';

var Text = types.Text;

describe.skip('types/Lazy', function () {
    this.timeout(3000);
    var remove;
    before(function () {
        remove = loader.addLoader({
            loadType(type){
                if (type == 'Text') {
                    return new Promise((resolve, reject) => {
                        setTimeout(()=> {
                            resolve(Text);
                        }, 500);
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
                                path="test"/>, false);

        var input = React.findDOMNode(TestUtils.scryRenderedDOMComponentsWithTag(root, 'span')[0]);
        expect(input.classList.contains('lazy-loading-type')).toBe(true);
        setTimeout(function () {
            try {
                expect(TestUtils.scryRenderedDOMComponentsWithTag(root, 'span')[0]).toNotExist();
                var text = TestUtils.scryRenderedComponentsWithType(root, Text)[0];
                expect(text).toExist();
                expect(React.findDOMNode(text).value).toBe('2');
            } catch (e) {
                done(e);
                return;
            }
            done();
        }, 600);
    });

});