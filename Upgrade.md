Subschema 0.1x -> 0.2 Upgrade Guide
---

##Dependencies
 * now requires react-0.14, react-dom and fbjs

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
   