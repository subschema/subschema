var React = require('../react');
var Button = React.createClass({
    getDefaultProps(){
        return {
            action: 'Submit',
            label: 'Submit',
            buttonClass: 'btn',
            handle: function () {

            }
        }
    },
    getInitialState(){
        return {
            disabled: this.props.disabled || false
        }
    },
    setDisabled(disabled){
        this.setState({disabled});
    },
    handler: function (e) {
        this.props.handler(e, this.props.action, this);
    },
    render(){
        return <button className={this.props.buttonClass} disabled={this.state.disabled}
                       onClick={this.handler}>{this.props.label}</button>
    }
});
module.exports = Button;