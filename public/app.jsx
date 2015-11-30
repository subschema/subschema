var React = require('react');
import { render } from 'react-dom'
import { Router, IndexRoute, Route, Link } from 'react-router'

require('./sample.less');

var SampleItem = require('./SampleItem.jsx');
var Index = require('./Index.jsx');
var Sample = require('./Sample.jsx');
var Setup = require('./Setup.jsx');

var routes = (
    <Router>
        <Route path='/' component={Sample}>
            <IndexRoute component={Index}/>
            <Route name="setup" path="setup/:setup" component={Setup}/>
            <Route name="item" path=":sample" component={SampleItem}/>
        </Route>
    </Router>
);

render(routes, document.getElementById('content'));