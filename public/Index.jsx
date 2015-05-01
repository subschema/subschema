var React = require('react');
var Index = React.createClass({
    render: function () {
        return (
            <div className="jumbotron">
                <h1>Subschema </h1>

                <p>This is app shows how to use Subschema</p>

                <p>You can see how it works by loading errors and data, from the buttons up top</p>

                <p><a className="btn btn-primary btn-lg" href="https://github.com/jspears/subschema" role="button">Learn
                    more</a></p>
            </div>
        );
    }
});
module.exports = Index;