var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var Wizard = require('../src/templates/WizardTemplate.jsx');
var Simulate = React.addons.TestUtils.Simulate;
describe('Wizard', function () {
    this.timeout(30000);
    var Form = require('subschema').Form;

    function into(node, debug) {
        return debug ? React.render(node, document.getElementsByTagName('body')[0]) :
            TestUtils.renderIntoDocument(node);
    }

    var schema = {
        schema: {
            username: {
                type: 'Text',
                help: 'Please enter your email address',
                validators: ['required', 'email']
            },
            password: {
                validators: ['required'],
                type: 'Password'
            },
            confirmPassword: {
                type: 'Password',
                validators: ['required', {type: 'match', field: 'password', message: 'Passwords do not match'}]
            },
            terms: {
                type: 'Checkbox',
                title: 'Do you accept the terms?'
            },
            address: {
                type: 'Object',
                subSchema: {
                    'address': {
                        type: 'Text',
                        validators: ['required']
                    },
                    'city': {
                        type: 'Text',
                        validators: ['required']
                    },
                    'state': {
                        type: 'Select',
                        options: ['CA', 'VA', 'DC'],
                        validators: ['required']
                    }
                }
            }

        },
        fieldsets: [{
            legend: 'Account',
            fields: ['username', 'password']
        }, {
            legend: 'Terms',
            fields: ['accept']

        },
            {
                legend: 'Address',
                fields: ['address.address', 'address.city', 'address.state']
            }

        ]
    }
    it('should create a new wizard', function () {

        var root = into(<Wizard schema={schema}/>);
        expect(root).toExist();
    });

})
