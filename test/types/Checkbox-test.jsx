var {React, into,TestUtils,expect, Simulate} = require('../support');

describe('Checkbox', function () {
    this.timeout(30000);
    var Form = require('subschema').Form;

    it('should create a form', function () {

        var root = into(<Form schema={{schema:{
            c1:'Checkbox',
            c2:{
                type:'Checkbox'
            }
        }}} />);
        expect(root).toExist();
        var ret = root.getValue();
        expect(ret.c1).toNotExist();
        expect(ret.c2).toNotExist();

    });
});