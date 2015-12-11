import React from 'react';
import { render } from 'react-dom';
import samples from './samples';
import develop from './develop';
import Subschema, {ValueManager, Form, decorators, loaderFactory, DefaultLoader}  from 'Subschema';
import schema from './schema.json';
import Navigate from './components/Navigate.jsx';
import NavListTemplate from './components/NavListTemplate.jsx';
import NavTemplate from './components/NavTemplate.jsx';
import ULTemplate from './components/ULTemplate.jsx';
import Link from './components/Link.jsx';
import Main from './components/Main.jsx';
import location from './location';

var loader = loaderFactory([DefaultLoader]);

loader.addType({
    Navigate,
    Link,
    Main
});
loader.addTemplate({
    NavListTemplate,
    NavTemplate,
    ULTemplate,
    H3(props){
        return <h3>{props.legend}</h3>
    }
});
loader.addTemplate(Object.keys(develop).reduce(function (obj, key) {
    obj['develop/' + key] = develop[key];
    return obj;
}, {}));


var valueManager = ValueManager({
    samples: samples,
    develop: develop
});

var loc;
// Listen for changes to the current location. The
// listener is called once immediately.
let unlisten = location.listen(location => {
    console.log('loc', location);
    loc = location;
    console.log(location.pathname)
    valueManager.update('pathname', location.pathname);
    valueManager.update('useData', location.query.useData);
    valueManager.update('useError', location.query.useError);
})
function handleDataError(val, old, path) {
    if (!val && loc.query[path] == 'true') {
        delete loc.query[path];
        location.push(loc);
    } else {
        if (loc.query[path] + '' != '' + val) {
            loc.query[path] = val;
            location.push(loc);
        }
    }
}
valueManager.addListener('useData', handleDataError, null, false);
valueManager.addListener('useError', handleDataError, null, false);


render(<Form valueManager={valueManager} schema={schema} loader={loader}
             template="FieldSetTemplate"/>, document.getElementById('content'));