var React = require('react');
var Highlight = require('../Highlight.jsx');
var WebpackSetup = React.createClass({
    render(){
        return (<div>
            <h3>Loader</h3>
            <fieldset>
                <legend></legend>
                <p className="lead">
                    Loaders are the key part to extending subschema. I am going to write something about it here.
                    Until then here is some loader zen.
                </p>

                <div className="panel">
                    <div className="panel-heading">
                        <h3>Writing a loader</h3>
                    </div>
                    <div className="panel-body">

                        <Highlight lang="javascript">
                            {require('!!raw!../sample-loader!./../samples/Loader-setup.jsx')}
                        </Highlight>
                    </div>
                </div>

            </fieldset>
        </div>);
    }
});
module.exports = WebpackSetup;

