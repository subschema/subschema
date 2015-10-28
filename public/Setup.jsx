var React = require('react');


var SetupHandler = React.createClass({
    render(){
        var Template = require('./setup/' + this.props.params.setup + '.jsx');
        return <Template {...this.props}/>
    }
});
module.exports = SetupHandler;