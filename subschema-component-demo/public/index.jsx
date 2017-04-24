import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Form, ValueManager, loader}  from 'subschema';
import devel from '../src/index';
import Index from './IndexPage.jsx';
import Demo from '../src/Demo.jsx';
import samples from 'subschema-test-samples';
import schema from './schema.json';

loader.addLoader(devel);
loader.addType({Index});

loader.loaderType('Sample');
loader.loaderType('Doc');

loader.addSamples(samples);
const ls = loader.listSamples();
const valueManager = ValueManager({
    samples: loader.listSamples().map(v => v.name)
});

render(<Demo valueManager={valueManager} schema={schema} loader={loader}
             template="FieldSetTemplate"/>, document.getElementById('content'));