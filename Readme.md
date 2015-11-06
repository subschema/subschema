#Subschema
Create forms by  declaring the schema in JSON.  Has validation,
data update, support for server side errors, and a bunch of input types.  Easily change all your
form field layouts.

The schema is borrowed
from [backbone-forms](https://github.com/powmedia/backbone-forms).

[![Build Status](https://travis-ci.org/subschema/subschema.svg?branch=master)](https://travis-ci.org/subschema/subschema)

###Example
You can see examples at [subschema.github.io/subschema](http://subschema.github.io/subschema/)

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
   - [Content](#content)
   - [Date](#date)
   - [DateTime](#datetime)
   - [Hidden](#hidden)
   - [LazyType](#lazytype)
   - [List](#list)
   - [Mixed](#mixed)
   - [Number](#number)
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
  var values = {}, errors ={};	
  var vm = ValueManager(values,errors);
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
   contextTypes: {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader
   },
   componentWillMount(){
     this._listener = this.context.valueManager.addListener(this.props.path, this.onUpdate, this, true);
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
    this.context.valueManager.update(this.props.path, value);
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


##Types
Subschema comes with a few built in types. You can create your own types as described elsewhere in the document.


###<a name="autocomplete"></a>Autocomplete
Autocomplete is an autocompleter, it has an optional processor which will resolve against the loaders installed processors.   

See the [example]("http://jspears.github.io/subschema/#/Autocomplete")


###<a name="checkbox"></a>Checkbox
A checkbox component 

###<a name="content"></a>Content
A Content component.  Will render safely as possible innerHTML.  It will also
subscribe to values that are put in the {name}.   You can nest content and types.

Super simple example.
```json
{
 content:'Stuff {substitute_this_value}'
}
```

A more sophisticated example using arrays and custom content.

```json
{
 'content':['Stuff {substitute_this_value}', {
   type:'h3',
   className:'some_class',
   content:'Hello {..another_value_from_parent}'
 }]
}
```


See the [example]("http://jspears.github.io/subschema/#/Content")


###<a name="checkboxes"></a>Checkboxes
Render an array of checkboxes.
Has an itemTemplate, and groupTemplate property that can be set to change the decoration around each checkbox, or group of checkboxes respectively.
See the [example]("http://jspears.github.io/subschema/#/Checkboxes")



###<a name="date"></a>Date
Barely a component, but oneday it will be made useful


###<a name="datetime"></a>DateTime
Barely a component, but oneday it will be made useful


###<a name="hidden"></a> Hidden
Hidden
Render a hidden input field

See the [example](http://jspears.github.io/subschema/#/Hidden)

###<a name="lazytype"></a>LazyType
A wrapper that will lazily load when the loader returns a Promise from a loader.   This probably should not be used directly.


###<a name="list"></a>List
Renders a list of objects.  A subschema can be specified to
describe items in the list.

It has the following extra options

 * canReorder - Allow reordering (default false)
 * canDelete - Allow deleting (default false)
 * canEdit - Allow editing (default false)
 * canAdd - Allow adding (default false)
 * itemTemplate - Template to wrap list items.
 * collectionCreateTemplate - Template for creating items.
 * itemType - The type of each item

See the [example](http://jspears.github.io/subschema/#/Todos)


###<a name="mixed"></a>Mixed
Much like a list but uses the keys of the objects instead of indexes. 

See the [example](http://jspears.github.io/subschema/#/Questionaire)

###<a name="number"></a>Number
A number type.  Probably better off using dataType=number.


###<a name="object"></a>Object
Renders an object key.   Wrapps said object in a fieldset by default. 

See the [example](http://jspears.github.io/subschema/#/NestedForms)

###<a name="password"></a>Password
Password type.

See the [example](http://jspears.github.io/subschema/#/Login)


###<a name="radio"></a>Radio
Renders radio groups. Options can be strings or
 {val, label} objects.

```js
  "type":"Radio",
  "options": [
        {
          "val": 0,
          "label": "Option 1"
        },
        {
          "val": 1,
          "label": "Option 2"
        },
        {
          "val": 2,
          "label": "Option 3"
        }
      ]
      
```
      
See the [example](http://jspears.github.io/subschema/#/Radio)




###<a name="restricted"></a>Restricted
Restrict the input format.  Its a little barbaric but 
has the built in restrictions

The formatter attribute can have the following

* uszip - US Zip Code
* capitalize - Capitalize the first letter.
* title - barbaric title casing.
* shortDate - MM/YY format.
* creditcard - Don't use its just an idea.  Real credit card numbers have all sorts of formats.
* 1 (###) ### #### - It will restirced the \# in any format 

See the [example](http://jspears.github.io/subschema/#/Restricted)


###<a name="select"></a>Select
A select component.  Uses the placeholder as the default value if set.   Tries to handle null value gracefully.

* options - An array of strings or {val, label} objects.
* multiple - If set to true it will allow for multiple selection.

See the [example](http://jspears.github.io/subschema/#/CarMake)

###<a name="text"></a>Text
Text input the default and the workhorse.  

See the [example](http://jspears.github.io/subschema/#/Basic)

###<a name="textarea"></a>TextArea
TextArea input pretty much same as text except its a textarea.

##<a name="templates"></a>Templates
Templates are the decoration around form elements.   Templates handle the display of error messages, or the actual type themself.  Anywhere a property is described as a Template, the loader will try to resolve the corresponding string to the template.

###<a name="wizard"></a>WizardTemplate
The wizard template is used to turn fieldsets into a wizard style entry.
See the [example](http://jspears.github.io/subschema/#/Wizard)


##Conditional
Sometimes you need some dynanicness in your schema.  To do this we have conditional.
The basic is it listens to a valueManager and then tries show or hide.

Props:
   
        * value (optional - any - null) - The value to listen to can if not given, than
          it will be a compare against not null.
         
        * listen (optional - string - path) The path to listen to can be empty, in which case will look for defaults to the current path.
          Can be relative '..' or absolute. Defaults to the current path.

        * template (optional - string|ReactFactory) The template to use if it evaluates to true IE - Modal, ShowHide

        * falseTemplate (optional - string|ReactFactory) The template to use if the expression evaluates to false.
        
        * animate (optional - boolean|string|object) A string to use  a named animation,or a boolean. if a string that string will be the "name" to use to animate.
          If an object is passed than it will passed as props to the transition group.
          If === true than the default animation will be used.
          If === false than no animation is used
         
        * operator (optional - string|regex - truthy
           How to compare the value to the matched value.
           If ommitted and a value is given than === is used.
           If ommitted and the value is ommitted than a truthy (!!value) is used.
           The built in operators are:
             * '==' - Same as javascript == 
             * '>=' 
             * '<='
             * '>'
             * '<'
             * '==='
             * '!==' - Special ones -
             * 'truthy' !!value
             * 'falsey' !value
             * '/regex/[gim]' /regex/.test()
             * '!/regex/[gim]' !/regext/.test();
             * 'something registed with the loader'
        
        * error  (optional - string) - The error path to listen to.   This path is evaluated slighty differntly, always absolute.   
        * dismiss (optional - string) - This will be set to false, given to make the current conditional false.   Set this for dismissing modals.  If 
          not provided, the template will recieve a dismiss property with the current key substituting '.' with '_' and prepended with an @

See the [example](http://jspears.github.io/subschema/#/Conditional)



##Validators
Validators are registered on a field as an array of strings or with configuration.
```js
  
  loader.addValidator('super', function(options){
    return function super$validator(value, valueManager){
        if (value !== 'super'){
            return {
                message:options.message || 'Not super?',
                type:'ERROR';
            }
        }
    }
  });

  var schema = {
     schema:{
        'validateme':{
           type:'Text',
           validators:['required', 'super']
        },
        'superv':{
          type:'Text',
          validators:[{type:'super', message:'This is not super'}]
        }
     }
    fields:['validateme', 'superv']  
  }

```

##Templates
Templates are used in field definitions, fieldsets and other places.   A template
is generally not very smart, and will be passed children.    If something needs to be
smart then, it should be a Type.   

Types by default will be wrapped an EditorTemplate.   You can install a new 
EditorTemplate in the loader to change the default template for all fields.

```js
  loader.addTemplate('EditorTemplate', //YourTemplate)

```

Or you can identify a template per field.   If template is false than no template is used
by the children are rendered.

```js
var schema = {
      schema:{
       'myfield':{
         type:'Text',
         template:'sometemplate'
      },
      'myotherfield':{
         type:'Text',
         template:{
             template:'otherTemplate',
             className:'stuff'
         }
      },
   },
   fieldsets:[{
         legend:'Stuff',
         fields:'myfield',
         template:{
            //using content instead of a registered template.
            content:[ 'hello', {
                 children:true
            }],
            //make it conditional on myotherfield equal 'is cool'
            conditional:{
               path:'myotherfield',
               value:'is cool',
               operator:'=='
            }
         }
      }, {
        fields:'myotherfield'
      }]
   
   }
}



```

##Fieldsets
Fieldsets wrap sets of fields.   This allows for grouping of elements.  By Default the FieldSetTemplate template
is used, and if a different FieldSetTemplate is defined in a  loader that will be used.

Fieldsets can be nested within each other allowing for fine grained grouping of types.

```js
  var schema = {
     schema:{
       firstName:'Text',
       lastName:'Text',
       description:'Text'
     },
     fieldsets:[{
        fieldsets:[{
          fields:'firstName, lastName'
        },
        {
         fields:['description']       
        }        
     }]
  
  }  

```





