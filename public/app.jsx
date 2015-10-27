var React = require('react');
import { render } from 'react-dom'
import { Router, IndexRoute, Route, Link } from 'react-router'

require('./sample.less');

var SampleItem = require('./SampleItem.jsx');
var Index = require('./Index.jsx');
var App = require('./Sample.jsx');
var Setup = require('./Setup.jsx');

var routes = (
    <Router>
        <Route path='/' component={App}>
            <IndexRoute component={Index}/>
            <Route name="item" path=":sample" component={SampleItem}/>
            <Route name="setup" path="setup/:setup" component={Setup}/>
        </Route>
    </Router>
);

render(routes, document.getElementById('content'));