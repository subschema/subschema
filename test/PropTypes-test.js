"use strict";

var expect = require('expect');
var PT = require('subschema').PropTypes;
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

});