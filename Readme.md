#Subschema
Create forms by  declaring the schema in JSON.  Has validation,
data update, support for server side errors, and a bunch of input types.  Easily change all your
form field layouts.

The schema is borrowed
from [backbone-forms](https://github.com/powmedia/backbone-forms).

[![Build Status](https://travis-ci.org/jspears/subschema.svg?branch=master)](https://travis-ci.org/jspears/subschema)

###Example
You can see examples at [jspears.github.io/subschema](http://jspears.github.io/subschema/)

###Install
```sh
 $ npm install subschema
 $ npm start &
 $ open http://localhost:8000
 //there are more details of whats going on here.
  http://localhost:8080/webpack-dev-server/

```

###Built In types

- [Schema Definition](#schema-definition)
   - [Autocomplete](#autocomplete)
   - [Checkbox](#checkbox)
   - [Checkboxes](#checkboxes)
   - [CollectionMixin](#collectionmixin)
   - [CreateItemMixin.js](#createitemmixin.js)
   - [Date](#date)
   - [DateTime](#datetime)
   - [Hidden](#hidden)
   - [LazyType](#lazytype)
   - [List](#list)
   - [Mixed](#mixed)
   - [Object](#object)
   - [Password](#password)
   - [Radio](#radio)
   - [Restricted](#restricted)
   - [Select](#select)
   - [Text](#text)
   - [TextArea](#textarea)


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
Events can be registered via the ValueManager.  You can subscribe to a path, a part of a path or all events of a
type.


Example:

```jsx

  var vm = ValueManager();
  //listen to all events
  vm.addListener(function(newValue, oldValue, path){


});
  vm.addListener('singlePath', function(newValue, oldValue path){
   //get all the values.  just for documentation sake.
   var value = vm.getValue();

  });
  vm.addErrorListener('path', function(){

});
  var App = React.createClass({
    handleSubmit(newValue, oldValue, property, path){
    },
    handleValueChange(newValue, oldValue, property, path){}
    handleValidate(){}
    render(){
        return <Form schema={'YourSchema'} onSubmit={this.handleSubmit} valueManager={vm}/>
    }
  
  });




```


#Custom Types
A new type doesn't have to do anything, but if you want its values to participate in
validation and value management it should regitster itself with the value manager.

```jsx

var MyType = React.createClass({
   componentWillMount(){
     this._listener = this.props.valueManager.addListener(this.props.path, this.onUpdate, this, true);
   },
   componenWillUnmount(){
     this._listener.remove();
   },
   //this will update your state, when valueManager is changes values.
   onUpdate(value){
        this.setState({value});
   },
   // this will update value manager when your component changes something.  onUpdate will set the state
   // of the component so don't do it here unless you want double state changes.
   update(value){
    this.props.valueManager.update(this.props.path, value);
   },
   //you know what to do.
   render(){
     return //magic here
   }



});


```

Or you can just use the mixin


```jsx

var MyType = React.createClass({
   mixin:['subschema/FieldValueMixin'],

});
```




<a name=autocomplete/>
##Autocomplete


<a name=checkbox/>
##Checkbox


<a name=checkboxes/>
##Checkboxes


<a name=collectionmixin/>
##CollectionMixin


<a name=createitemmixin.js/>
##CreateItemMixin.js


<a name=date/>
##Date


<a name=datetime/>
##DateTime


<a name=hidden/>
##Hidden


<a name=lazytype/>
##LazyType


<a name=list/>
##List


<a name=mixed/>
##Mixed


<a name=object/>
##Object


<a name=password/>
##Password


<a name=radio/>
##Radio


<a name=restricted/>
##Restricted


<a name=select/>
##Select


<a name=text/>
##Text


<a name=textarea/>
##TextArea



