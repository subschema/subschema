module.exports = {
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