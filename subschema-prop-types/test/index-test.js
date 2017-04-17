import PT from '../dist/index';
import expect from 'expect';
import PropTypes from 'prop-types';

describe('PropTypes', function () {

    it('should enumerate proptypes to names', function () {
        var out = PT.propTypesToNames({
            myprop: PT.arrayString,
            myevent: PT.event,
            mystr: PT.string,
            mycss: PT.cssClass.isRequired,
            myarr: PT.arrayString.isRequired
        });
        expect(out.myprop).toEqual('arrayString')
        expect(out.myevent).toEqual('event')
        expect(out.mystr).toEqual('string')
        expect(out.mycss).toEqual('*cssClass')
        expect(out.myarr).toEqual('*arrayString')

    });

    it('should handle something complex like content', function (done) {
        var content = [{
            "className": "clz-left",
            "content": [{"type": "h1", "content": "Heading stuff {hello}"}, {
                "type": "p",
                "content": "Super special content"
            }, {"type": "button", "className": "btn btn-primary", "content": "Activate"}]
        }, {
            "className": "clz-right",
            "content": [{"type": "img", "className": "super-img", "src": "about:blank", "content": false}]
        }];
        PropTypes.checkPropTypes(PT.content, {content}, 'content', 'Test',  function getStack(e){
            done();
        });
    });

});