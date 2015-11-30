Subschema 0.2x ->0.5 Upgrade
##Dependencies
##Webpack
## API Changes
  * Mixins are now defunct.  Some have been changed to base classes, others are no longer needed.
  * Components no longer manage their own state.  Instead a 'value' property is passed.
  * ValueManagerListenerMixin is replaced with @listeners and @listen respectively.
  * Core components are now in components/
  * ValueManager#removeListener now must take a listener no longer supports a  path.
  * No longer includes the React.js exported, now it just import React from  'react'.
  * EditorTemplate now will pass error with the first error and errors with all errors into the corresponding template.
  * NestedMixin is now just types/Object.jsx.  The property to change the template is objectTemplate.
  * DefaultLoader is now powered by decorators.
    - Use @provide.type, @provide.validator @provide.loader respectively.
  * Injection - Types are now injected with the corresponding object according to the propTypes object on the object.
  * Now using ES6 style classes.
  * valueManager and loader  are now injected via context to use directly.
   ```js
      var PropTypes = Subschema.PropTypes;
      
      class SomeClass {
        static contextTypes = PropTypes.contextTypes;
        //now this.context will have valueManager and loader;
      }
   
   
   ```




Subschema 0.1x -> 0.2 Upgrade Guide
---

##Dependencies
 * now requires react-0.14, react-dom and fbjs

##Webpack

 * If you are using webpack to build subschema you will need to add an alias from
 ```  
  resolve: {
        extensions:['','.js','.jsx'],
        alias: {
            'subschema': path.join(__dirname, 'node_modules/subschema/src/index.jsx'),
            'subschema-styles':path.join(__dirname, 'node_modules/subschema/src/styles')
        }
    }
```


## API Breakage
 * Components that use BasicFieldMixin (Perhaps Transitively) need to use this.triggerUpdate rather than this.props.handleChange.
 * valueManager and loader are now part of context instead of props.   This makes most things more convenient, (except testing) but 
   removes a lot of PNA and could increase performance.   Make sure if you need to have a valueManager or loader to add the 
   ```js
     import {PropTypes} from 'subschema';
     
     React.createClass({
     contextTypes:{
        valueManager:PropTypes.valueManager,
        loader:PropTypes.loader
     }
     //everything else
     });   
   ```
 * Form without a schema will throw an error.
 * form.js and form.jsx are gone.  Please use Form.jsx. 
 * Editor.js is now Editor.jsx - to follow React Components end in jsx all else ends in js.
 * Form now is just a passthrough to ObjectType, rather than a Mixin of NestedMixin.  As a result I may drop NestedMixin in future
   releases.
 * fields and fieldsets should be defined in the schema,  rather than passed as props.
   ```js
    {
      schema:{
      },
      fields:[],
      fieldsets:[]
    
    } 
    ```
 
 * All classes are now exported in the Subschema namespace.
   Subschema.templates is now the same as require('subschema/templates'), but you don't have to have babel or webpack to get to the
   things.   Mostly done to make the subschema.js and subschema-noreact.js dists easier to test.
   
