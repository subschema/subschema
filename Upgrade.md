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
 * form without a schema will throw an error.
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
 
 