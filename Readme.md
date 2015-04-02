#Subschema
Create forms by just declaring the schema.  Has validation,
update, support for server side errors.  Easily change all your
form field layouts, for consisten usage.   Easily create form
builders or config editors. 

The schema is borrowed
from (backbone-forms)[https://github.com/powmedia/backbone-forms].


###Install
```sh
 $ npm install bb-react-forms
 $ npm start &
 $ open http://localhost:8000
 //there are more details of whats going on here.
  http://localhost:8080/webpack-dev-server/

```


###Example
```jsx
    <Form
        action='/submit/path'
        method='POST'
         schema= {{
        schema:{
            title:      { type: 'Select', options: ['Mr', 'Mrs', 'Ms'] },
            name:       'Text',
            email:      { validators: ['required', 'email'] },
            birthday:   'Date',
            password:   'Password',
            address:    { type: 'Object',
                subSchema:{
                    'street':{
                      type:'Text',
                      validators:['required']
                    },
                    city:'Text',
                    zip:{
                      type:'Text',
                      validators:['required', /\d{5}(-\d{4})?/]
                    }
                }
            },
            notes:      { type: 'List', itemType: 'Text' }
        },
        fieldsets:[
                     {legend:'Name', fields:['title', 'email', 'name', 'password']},
                     {legend:'Address', fields:['address.street', 'address.city', 'address.zip']}
                  ]

        }}

    }/>


```
