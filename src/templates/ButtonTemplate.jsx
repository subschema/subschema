var React = require('../react');
var Button = React.createClass({
    getDefaultProps(){
        return {
            action: 'Submit',
            label: 'Submit',
            buttonClass: 'btn',
            iconClass: null
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
    handleClick(e){
        this.props.onClick(e, this.props.action, this);
    },
    render(){
        return <button className={this.props.buttonClass} disabled={this.state.disabled}
                       onClick={this.handleClick}>
            {this.props.iconClass ? <i className={this.props.iconClass}/> : null}
            {this.props.label}</button>
    }
});
module.exports = Button;