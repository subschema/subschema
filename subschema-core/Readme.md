#Subschema [![Build Status](https://travis-ci.org/subschema/subschema.svg?branch=master)](https://travis-ci.org/subschema/subschema)

Create forms by  declaring the schema in JSON.  Has validation,
data update, support for server side errors, and a bunch of input types.  Easily change all your
form field layouts.

The schema is borrowed
from [backbone-forms](https://github.com/powmedia/backbone-forms).

More information can be found on the [wiki](https://github.com/subschema/subschema/wiki)

###Example
You can see examples at [subschema.github.io/subschema](http://subschema.github.io/subschema/)

###Install

```sh
 $ npm install subschema

```
### Usage
You can use the [demo](https://subschema.github.io/subschema) to generate a skeleton
project with webpack, karma and more for getting started.

```es6
import React, {Component] from 'react';
import {Form} from 'Subschema';
```

###Built In Types
   - [Autocomplete](#autocomplete)
   - [Checkbox](#checkbox)
   - [Checkboxes](#checkboxes)
   - [Content](#content)
   - [Date](#date)
   - [DateTime](#datetime)
   - [Hidden](#hidden)
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

See the [example](http://subschema.github.io/subschema/#/Loader)


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
  vm.addListener(null, function(newValue, oldValue, path){
//listens to all changes

});
  vm.addListener('singlePath', function(newValue, oldValue path){
   //get all the values.  just for documentation sake.
   var value = vm.getValue();

  });
  vm.addErrorListener('path', function(){

});
  class App extends React.Component {
    handleSubmit = (newValue, oldValue, property, path)=>{
    }
    render(){
        return <Form schema={'YourSchema'} onSubmit={this.handleSubmit} valueManager={vm}/>
    }
  
  }
  
```

If you need to listen to a particular path use the PropType.

```js
   import {PropTypes} from Subschema;
   class ListeningType extends Component {
      static propTypes = {
         value:PropTypes.value   
      }
      static defaultProps = {
        //optional if its '.'
         value:'.'
      }
      render(){
        return <span>{this.props.value}</span>
      }
 
    }


```



#Custom Types
You can add new types by adding them to the loader. You can use the default loader
at Subschema.loader or create a new loader from a loader factory.
```jsx
  import {loaderFactory, DefaultLoader} from 'Subschema';
  const yourLoader = loaderFactory();
  //you may want to have the default loader for the templates and types.
  yourLoader.addLoader(DefaultLoader);

  yourloader.addType(...)
  
  
  ...
  class YourApp extends Component {
  render()
  <Form loader={yourloader} ...
}
```



```js

  loader.addType('YourType', YourType);
```
Example:



```jsx
      import React from 'react';
      import {types, loader} from  'Subschema';
      var {Select, Checkbox} = types;
      
      class CheckboxSelect extends React.Component {
       
                   //allows for injection of the Select properties.
                   static propTypes = Select.propTypes;
       
                   constructor(...rest) {
                       super(...rest);
                       //init state
                       this.state = {disabled: false};
                   }
       
                   render() {
                       var {className, ...props} = this.props;
                       return <div className={className}>
                           <Checkbox onChange={(e)=>this.setState({disabled: !e})} checked={!this.state.disabled}/>
                           <Select {...props} disabled={this.state.disabled}/>
                       </div>
                   }
         }
        loader.addType('CheckboxSelect',CheckboxSelect);
        var schema = {
            schema: {
                'test': {
                    type: 'CheckboxSelect',
                    options: 'first,second,third'
                }
            },
            fields: 'test'
        }


```



##Types
Subschema comes with a few built in types. You can create your own types as described elsewhere in the document.


###<a name="autocomplete"></a>Autocomplete
Autocomplete is an autocompleter, it has an optional processor which will resolve against the loaders installed processors.   

See the [example](https://subschema.github.io/subschema/#/Autocomplete)


###<a name="checkbox"></a>Checkbox
A checkbox component 
See the [example](https://http://subschema.github.io/subschema/#/Checkboxes)

###<a name="content"></a>Content
A Content component.  Will render safely as possible innerHTML.  It will also
subscribe to values that are put in the {name}.   You can nest content and types.

Super simple example.
```json
{
 "content":"Stuff {substitute_this_value}"
}
```

A more sophisticated example using arrays and custom content.

```json
{
 "content":["Stuff {substitute_this_value}", {
   "type":"h3",
   "className":"some_class",
   "content":"Hello {..another_value_from_parent}"
 }]
}
```


See the [example]("http://subschema.github.io/subschema/#/Content")


###<a name="checkboxes"></a>Checkboxes
Render an array of checkboxes.
Has an itemTemplate, and groupTemplate property that can be set to change the decoration around each checkbox, or group of checkboxes respectively.
See the [example]("http://subschema.github.io/subschema/#/Checkboxes")



###<a name="date"></a>Date
Barely a component, but oneday it will be made useful


###<a name="datetime"></a>DateTime
Barely a component, but oneday it will be made useful


###<a name="hidden"></a> Hidden
Hidden
Render a hidden input field

See the [example](http://subschema.github.io/subschema/#/Hidden)


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

See the [example](http://subschema.github.io/subschema/#/Todos)


###<a name="mixed"></a>Mixed
Much like a list but uses the keys of the objects instead of indexes. 

See the [example](http://subschema.github.io/subschema/#/Questionaire)

###<a name="number"></a>Number
A number type.  Probably better off using dataType=number.

See the [example](http://subschema.github.io/subschema/#/Basic)

###<a name="object"></a>Object
Renders an object key.   Wrapps said object in a fieldset by default. 

See the [example](http://subschema.github.io/subschema/#/NestedForms)

###<a name="password"></a>Password
Password type.

See the [example](http://subschema.github.io/subschema/#/Login)


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
      
See the [example](http://subschema.github.io/subschema/#/Radio)




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

See the [example](http://subschema.github.io/subschema/#/Restricted)


###<a name="select"></a>Select
A select component.  Uses the placeholder as the default value if set.   Tries to handle null value gracefully.

* options - An array of strings or {val, label} objects.
* multiple - If set to true it will allow for multiple selection.

See the [example](http://subschema.github.io/subschema/#/CarMake)

###<a name="text"></a>Text
Text input the default and the workhorse.  

See the [example](http://subschema.github.io/subschema/#/Basic)

###<a name="textarea"></a>TextArea
TextArea input pretty much same as text except its a textarea.

##<a name="templates"></a>Templates
Templates are the decoration around form elements.   Templates handle the display of error messages, or the actual type themself.  Anywhere a property is described as a Template, the loader will try to resolve the corresponding string to the template.

###<a name="wizard"></a>WizardTemplate
The wizard template is used to turn fieldsets into a wizard style entry.
See the [example](http://subschema.github.io/subschema/#/Wizard)


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

See the [example](https://subschema.github.io/subschema/#/Conditional)



##Validators
Validators are registered on a field as an array of strings or with configuration.
```js
  
  loader.addValidator('super', function(options){
    return function super$validator(value, valueManager){
        if (value !== 'super'){
            return {
                message:options.message || 'Not super?',
                type:'ERROR'
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
is used, and if a different FieldSetTemplate is defined in a  loader that will be used.  FieldSet's can now take any
other property defined in their template.    

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

## Custom Types
Subschema allows for custom types to be created.   Types are injected with the declared propTypes and defaultProps.  
The most magical bit is the onChange prop is different depending if it is PropTypes.valueEvent or PropTypes.targetEvent.
If it is a valueEvent than subschema just passes the value down to the ValueManager if it is a targetEvent, it passes
e.target.value to the valueManager.   This allows for a very simple api to create new types.

Types get passed value along with any other properties descriped in the static propTypes.  Types no longer have to 
implement anything, other than React.Component.   State is managed by the editor.


## Expression Properties
Occasionally it would be nice to bind the value of a property to the value manager.   We got you covered.  To make a 
property of a custom component you can use the substitution language used in the Content object.  As of now, none of the
default components take the expression syntax.   This may change in the future.  It would pretty easy to extend the 
propTypes on existing components to make thier values dynamic.

Example:
```jsx
   
   class Anchor extends React.Component {
     static propTypes = {
       //by making this propType an expression it will evaluate it dynamically.
       href:PropTypes.expression,
       label:PropTypes.string
     };
     static defaultProps = {
       href:'/somewhere/{..page}'
     }
     render(){
       return <a href={this.props.href}>{this.props.label}</a>
     }
   }
```
  
Now the {..page} will be substituted with the page value in the valueManager. You can of course override the 
default prop in the schema. Note the .. makes it look up a level for the value.  No dots means look in the 
current path + name, a single dot, is the current path.  This is follows the listener conventions elsewhere.

Example Usage:
```jsx
  
    var schema = {
    
       schema:{
          selectPage:{
            type:'Select',
            options:'Page1, Page2, Page3'
          },
          link1:{
            type:'Anchor',
            label:'Go To Page',
            href:'/{..selectPage}/index.html'
          }
       },
       fields:"selectPage, link1"
    }

   <Form schema={schema}/>  
```  
   
Now when a user changes the selectPage, then the Anchor (link1} will reflect said change.
  
The default substitution engine can be changed by setting expressionEngine on Editor
```jsx
  import {Editor} from "Subschema";
  
  Editor.expressionEngine = function() {
     return {
        format(string){
        listen:[]//array of paths to listen to.
     }
   }
  
  
```  

See the [example](https://subschema.github.io/subschema/#/Expression)

##Listener Properties
Sometimes you need a property to be dependent on a value in the value manager.  To do that use the listener propType. 
The property then will be in sync with the value in the value manager.   The value of the property in the configuration
should be the path to the value that you are interested in.  PropTypes.error will listen to the first error for the path
and PropTypes.errors will get all props for the path.


```jsx

var {PropTypes, loader, types} = Subschema;
var {Select} = types;

//copy propTypes (don't ref it will break Select)
var {options, ...copyPropTypes} = Select.propTypes;
copyPropTypes.options = PropTypes.listener;

class SelectListen extends React.Component {
    static propTypes = copyPropTypes;

    render() {
        return <Select {...this.props}/>
    }
}
loader.addType('SelectListen', SelectListen);

schema = {
     schema: {
              myDefault: {
                  type: 'SelectListen',
                  options: 'favorites'
              },
              favorites: {
                  type: 'List',
                  canAdd: true,
                  canEdit: true,
                  canReorder: true,
                  canDelete: true,
                  labelKey:'label',
                  itemType: {
                      type: 'Object',
                      subSchema: {
                          val: 'Text',
                          label: 'Text'
                      }
                  }
              }
          },
          fields: "myDefault, favorites"

}
//Now the options in myDefault are linked to the values in myFavorites.
```

 
