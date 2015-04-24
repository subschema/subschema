var Router = require('react-router');
var React = require('react');
var { Route,DefaultRoute } = Router;
require('./sample.less');

var SampleItem = require('./SampleItem.jsx');
var Index = require('./Index.jsx');
var App = require('./Sample.jsx');
var Setup = require('./Setup.jsx');

var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Index}/>
        <Route name="item" path=":sample" handler={SampleItem}/>
        <Route name="setup" path="setup/:setup" handler={Setup}/>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});