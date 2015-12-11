import React from 'react';
import { render } from 'react-dom';
import samples from './samples';
import develop from './develop';
import Subschema, {ValueManager, Form, decorators, loaderFactory, DefaultLoader}  from 'Subschema';
import schema from './schema.json';
import Navigate from './components/Navigate.jsx';
import NavTemplate from './components/NavTemplate.jsx';
import ULTemplate from './components/ULTemplate.jsx';
import Link from './components/Link.jsx';
import Main from './components/Main.jsx';
import Example from './components/Example.jsx';
import Index from './Index.jsx';

import history from './location';

var loader = loaderFactory([DefaultLoader]);

loader.addType({
    Navigate,
    Link,
    Main,
    Index,
    Example
});
loader.addTemplate({
    NavTemplate,
    ULTemplate,
    H3(props){
        return <h3>{props.legend || props.children}</h3>
    }
});

loader.addType(Object.keys(develop).reduce(function (obj, key) {
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
let unlisten = history.listen(location => {
    console.log('loc', location);
    var pathname = location.pathname, type = pathname.replace(/\#?\//, '');

    if (!loc || loc.pathname != pathname) {
        valueManager.update('pathname', location.pathname);
    }
    // if (!loc || loc.query.useData != location.query.useData) {
    valueManager.update('useData', location.query.useData == "true");
    // }
    // if (!loc || loc.query.useError != location.query.useError) {
    valueManager.update('useError', location.query.useError == "true");
    // }
    if (/develop/.test(pathname)) {
        valueManager.update('main.component', type);
        valueManager.update('main.conf', null);
    } else if (type) {
        console.log('update', type);
        valueManager.update('main.component', 'Example');
        valueManager.update('main.example', type);
        var conf = samples[type];
        valueManager.update('main.conf', conf);
    } else {
        valueManager.update('main.component', 'Index');
        valueManager.update('main.conf', null);
    }
    loc = location;

})

function handleDataError(val, old, path) {
    //make sure the poll cycle exists first;
    setTimeout(()=> {
        if (loc == null || val == null) {
            return;
        }
        if (val) {
            if (loc.query[path] === 'true') return;
            loc.query[path] = 'true';
            var {pathname, query, state } = loc;
            history.push({pathname, query, state});
        } else {
            if (loc.query[path] === 'true') {
                delete loc.query[path];
                var {pathname, query, state } = loc;
                history.push({pathname, query, state});
            }
        }
    }, 20);

}
valueManager.addListener('useData', handleDataError, null, false);
valueManager.addListener('useError', handleDataError, null, false);


render(<Form valueManager={valueManager} schema={schema} loader={loader}
             template="FieldSetTemplate"/>, document.getElementById('content'));