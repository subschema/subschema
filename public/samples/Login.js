module.exports = {
    description: 'This is a very basic login form. But it shows both email validation and multi field validation',
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
        fieldsets: [{legend: 'Login Form', fields: ['username', 'password', 'confirmPassword']}],
        submitButton: 'Login'
    },
    data: {},
    errors: {
        username: [{
            message: 'This username already exists'
        }]
    }


}