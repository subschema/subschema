module.exports = {
    description: 'This shows a multistep form aka Wizard.\
    The basics are your fieldsets become steps in a wizard.  The legend becomes the label and the fields are rendered\
    Sometimes you a good wizard goes a long way\
    ',
    props: {
        template: 'WizardTemplate'
    },
    data: {
        username: 'a@b.c',
        password: '123',
        confirmPassword: '123',
        terms: false,
        address: {
            address: '1 Main St',
            city: 'Arlington',
            state: 'CA',
            zip: 95130
        }
    },
    schema: {
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
                title:false,
                help:false,
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
        template:'WizardTemplate',
        fieldsets: [{
            legend: 'Account',
            fields: ['username', 'password', 'confirmPassword']
        }, {
            legend: 'Terms',
            fields: ['terms']

        }, {
            legend: 'Address',
            fields: ['address.address', 'address.city', 'address.state']
        }]
    }
}