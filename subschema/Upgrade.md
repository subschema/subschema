Subschema 1.2.x ->1.3.0
## API Changes
* Removed SubstituteMixin functionality now exists in subschema-expression.

Subschema 1.1.x -> 1.2.1
### API Changes
* Decorators have been removed, just use the loader instead. Its shorter
easier to understand.

Subschema 1.0.0 -> 1.1.0 
##API Changes
* Properties configured with PropTypes.template now returns an object containing Template:InjectedTemplate, {...options}. 
  It makes all templates configurable, however, if your component uses a template, than it will be changed.   You can use RenderTemplate to make
  rendering them easy.
* The injector can now use string propTypes.   Of course react will complain, but see the next line for the why.
* The injectorFactory now resolves injectedProps and injectedPropTypes before anything else.  Allowing a component to be
  subschema configurable, with no dependencies on subschema. 
* subschema-devel is a meta project to make getting up and running developing subschema faster and easier.
* Now we are using postcss-loader instead of autoprefixer-loader, as it was depricated.  
* Loader now lets you create your own loader types.  loader.loaderType('Stuff') will make loader.addStuff, loader.listStuffs, 
  available.

Subschema 0.6.x -> 1.0.0 Upgrade

##API Changes
 * Templates/FieldSets are now injectable.
 * Transitions are now injectable per field or fieldset.
 * style property will load from loader, based on className.
 * -EventCSSTransition has been replaced with ReactCSSReplaceTransition.jsx.
 * -loader.js is removed now use import.
 * Subschema.newSubschemaContext() - will setup a new loader, and magic.
 * Listener decorators are gone.   They where a bad idea, and have been replaced with injection.
 * Resolvers are new.   More on that later.
 * Conditional, not sure what I was thinking with the original api/example but it was a bit insane. Has been
   changed to just an configuration object. To match the condition, rather than object properties.
 * You can call a eventables remove more than once.  You shouldn't but it should not break anything.
 * Wizard - Buttons are passed as objects, rather than rendered.
 * Editor has been replaced with Field, much much simpler.
 * Most css classes are replacing what not in addition to.   This makes things easier but will break some UI.  Just include
   the original css class in with your additionally configured one to fix. 
 * CSS class injection now ends in Class.  May need to fix some components but it should be buttonClass, modalClass, etc.   
 
   


Subschema 0.5.6 -> 0.6.0 Upgrade
##Dependencies
  * +react-dom
##API Changes
  * Forms are no longer use form-horizontal className. To change it back you can set it 
```js

subschema.styles.FormTemplate.formClass = 'form-horizontal';

```
  * Listener Properties now exist.  They are similar to expressions, but only listen to the path specified. 
  * Demo has been reworked to use Subschema, and removed react-router.
  * Demo now has the value preview built in the Playground component, to fix some nasty state issues using component-playground.
  * Fixes to ValueManager not creating intermediate objects.

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
   
