export default({
    "name": "Login",
    "description": "Simple login form",
    "value": {
        "email": "somewhere@someplace.com",
        "password": "abc123"
    },
    errors: {
        "email": [{
            message: 'This email does not exist.'
        }]
    },
    "schema": {
        "schema": {
            "email": {
                "type": "Text",
                "validators": [
                    "required",
                    "email"
                ]
            },
            "password": {
                "type": "Password",
                "validators": [
                    "required"
                ]
            },
            "remember": {
                "type": "Checkbox",
                "title": "Remember Me?"
            },
        },
        fieldsets: [{
            fields: ["email", "password", "remember"], buttons: ["Cancel", {
                label: "Login",
                type: "Submit",
                primary: true
            }]
        }]
    }
})