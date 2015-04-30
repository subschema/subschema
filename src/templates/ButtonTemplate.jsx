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
        var {buttonClass, title, iconClass, onClick, label, ...props} = this.props;
        return <button className={buttonClass} title={title} disabled={this.state.disabled}
                       onClick={this.handleClick} {...props}>
            {iconClass ? <i className={iconClass}/> : null}
            {label}</button>
    }
});
module.exports = Button;