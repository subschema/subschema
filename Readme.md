#Subschema
Create forms by just declaring the schema.  Has validation,
update, support for server side errors.  Easily change all your
form field layouts, for consisten usage.   Easily create form
builders or config editors. 

The schema is borrowed
from [backbone-forms](https://github.com/powmedia/backbone-forms).


###Install
```sh
 $ npm install bb-react-forms
 $ npm start &
 $ open http://localhost:8000
 //there are more details of whats going on here.
  http://localhost:8080/webpack-dev-server/

```

###Example
You provide the schema and subschema renders it.  Keeping the values,
and errors in check. 


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
## Loaders
Subschema allows for new types, validators, templates and even schemas to be registered with loaders.   To add your own 
of any of these call the corresponding add method.

### Type Loader

This adds a type "ToggleType" to the loaders.  Now you can
use this type anywhere in your schema, you would otherwise use a 
type.

Example:
```jsx
var loader = require('subschema').loader;

loader.addType('ToggleType', React.createClass({
                                         displayName: 'ToggleObject',
                                         getInitialState(){
                                             return {
                                                 toggled: false
                                             }
                                         },
                                         handleToggle(){
                                             this.setState({toggled: !this.state.toggled});
                                         },
                                         getValue(){
                                             return this.refs.val.getValue()
                                         },
                                         setValue(val){
                                             this.refs.val.setValue(val);
                                         },
                                         render(){
                                             var style = {
                                                 display: this.state.toggled ? 'none' : 'block'
                                             };
                             
                                             return <div className="form-group row">
                                                     <legend onClick={this.handleToggle}>Toggle {this.state.toggled ? 'Up' : 'Down'}</legend>
                                                     <div style={style}>
                                                         <Object ref="val" {...this.props}/>
                                                     </div>
                                             </div>;
                             
                                         }
                                     }));

```

## Schema Loader
Sometimes it is useful to reuse an exisiting schema.   We got you covered, just register your schema
and reference it as a string in anywhere an object  takes a subSchema or a schema.


Example:
This example uses 2 registered schemas, one used by the List type the other used by the form type.

```js
  var loaded = loader.addSchema({
            Address: {
                address: 'Text',
                city: 'Text',
                state: {
                    type: 'Select',
                    options: ['CA', 'FL', 'VA', 'IL']
                },
                zipCode: {
                    type: 'Text',
                    dataType: 'number'
                }
            },
            Contact: {
                schema: {
                    name: 'Text',
                    primary: {
                        type: 'ToggleObject',
                        subSchema: 'Address',
                        template: 'SimpleTemplate'
                    },
                    otherAddresses: {
                        canEdit: true,
                        canReorder: true,
                        canDelete: true,
                        canAdd: true,
                        type: 'List',
                        labelKey: 'address',
                        itemType: {
                            type: 'Object',
                            subSchema: 'Address'
                        }
                    }
                },
                fields: ['name', 'primary', 'otherAddresses']
            }
        });


   <Form schema="Contact"/>

```

##Events
Subschema exposes 3 main events, onValueChange, onSubmit and onValidate.  Returning false from one of these handlers will
stop the processing.

Example:
```jsx

  var App = React.createClass({
    handleSubmit(newValue, oldValue, property, path){
    },
    handleValueChange(newValue, oldValue, property, path){}
    handleValidate(){}
    render(){
        return <Form schema={'YourSchema'} onSubmit={this.handleSubmit} onValueChange={this.handleValueChange}
           onValidate={this.handleValidate}
    }
  
  });



```

#Custom Types
A new type will need to implement 2 methods, getValue(), and setValue() and receive a property of value. They also need
to be registered with the loader.

```jsx
var loader = require('subschema').loader;

loader.addType('Simple', React.createClass({
    getInitialState(){
      return {
        value:this.props.value
      }
    },
    setValue(val){
        this.setState({value:val});
    },
    getValue(){
        return this.state.value
    },
    render(){
        <input value={this.state.value}/>       
    }

});

```





