import React from 'react';
import {render} from 'react-dom';
import {ValueManager, loader}  from 'subschema';
import samples from 'subschema-test-samples';
import Index from './IndexPage.jsx';
import schema from './schema.json';
import createHistory from 'history/createHashHistory';
import {NavigationForm} from 'subschema-component-navigation';
import "./sample.lessp";
const history = createHistory({
    hashType: 'slash' // Google's legacy AJAX URL format

});
loader.addType({Index});

loader.loaderType('Sample');
loader.loaderType('Doc');

loader.addSamples(samples);
const valueManager = ValueManager({
    samples: loader.listSamples().map(v => v.name)
});

render(<NavigationForm valueManager={valueManager} history={history} schema={schema} loader={loader}
             template="FieldSetTemplate"/>, document.getElementById('content'));