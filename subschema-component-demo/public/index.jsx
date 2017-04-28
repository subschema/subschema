import React from 'react';
import {render} from 'react-dom';
import {ValueManager, loader}  from 'subschema';
import samples from 'subschema-test-samples';
import Demo from 'subschema-component-demo/lib/Demo.jsx';
import Index from './IndexPage.jsx';
import schema from './schema.json';

loader.addType({Index});

loader.loaderType('Sample');
loader.loaderType('Doc');

loader.addSamples(samples);
const valueManager = ValueManager({
    samples: loader.listSamples().map(v => v.name)
});

render(<Demo valueManager={valueManager} schema={schema} loader={loader}
             template="FieldSetTemplate"/>, document.getElementById('content'));