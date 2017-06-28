import 'babel-polyfill';
function load(ctx) {
    ctx.keys().forEach(ctx);
}
load(require.context('./subschema-component-autocomplete/test', true, /-test\.jsx?$/));
load(require.context('./subschema-component-form/test', true, /-test\.jsx?$/));
load(require.context('./subschema-component-list/test', true, /-test\.jsx?$/));
load(require.context('./subschema-component-modal/test', true, /-test\.jsx?$/));
load(require.context('./subschema-component-playground/test', true, /-test\.jsx?$/));
load(require.context('./subschema-component-wizard/test', true, /-test\.jsx?$/));
load(require.context('./subschema-project/test', true, /-test\.jsx?$/));
load(require.context('./subschema/test', true, /-test\.jsx?$/));


/*
load(require.context('./subschema-component-autocomplete/test', true,
    /-test\.jsx?$/));

load(require.context('./subschema-component-form/test', true, /-test\.jsx?$/));

load(require.context('./subschema-component-modal/test', true, /-test\.jsx?$/));
*/

/*
 subschema-component-autocomplete/test
 subschema-component-form/test
 subschema-component-list/test
 subschema-component-modal/test
 subschema-component-playground/test
 subschema-component-wizard/test
 subschema-project/test
 subschema/test

 */

/*load(require.context('./subschema-component-list/test', true,
    /-test\.jsx?$/));

 var ctx1 = require.context('./subschema-component-demo/test', true,
 /-test\.jsx?$/);
 ctx1.keys().forEach(ctx1);
 \
 ctx2.keys().forEach(ctx2);
 var ctx3 = ;
 ctx3.keys().forEach(ctx3);
 var ctx4 = require.context('./subschema-component-modal/test', true,
 /-test\.jsx?$/);
 ctx4.keys().forEach(ctx4);
 var ctx5 = require.context('./subschema-component-navigation/test', true,
 /-test\.jsx?$/);
 ctx5.keys().forEach(ctx5);
 var ctx6 = require.context('./subschema-component-playground/test', true,
 /-test\.jsx?$/);
 ctx6.keys().forEach(ctx6);
 var ctx7 = require.context('./subschema-component-wizard/test', true,
 /-test\.jsx?$/);
 ctx7.keys().forEach(ctx7);
 var ctx8 = require.context('./subschema-css-bootstrap/test', true,
 /-test\.jsx?$/);
 ctx8.keys().forEach(ctx8);
 var ctx10 = require.context('./subschema-project/test', true, /-test\.jsx?$/);
 ctx10.keys().forEach(ctx10);
 var ctx11 = require.context('./subschema-test-samples/test', true,
 /-test\.jsx?$/);
 ctx11.keys().forEach(ctx11);
 */
