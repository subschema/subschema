module.exports = {
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
                validators: [{type: 'match', field: 'password', message: 'Passwords do not match'}]
            }
        },
        submitButton: 'Login'
    },
    data: {},
    errors: {
        username: [{
            message: 'This username already exists'
        }]
    }


}