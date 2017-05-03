import React, {Component} from 'react';
import Button from 'react-native-button';
import ButtonTemplate from 'subschema-component-form/lib/templates/ButtonTemplate';
const {propTypes, defaultProps} =ButtonTemplate;

export default class ButtonsTemplateNative extends Component {
    static propTypes = propTypes;
    static defaultProps = {
        ...defaultProps,
        action: 'Submit',
        label: 'Submit',
        buttonClass: 'btn',
        iconClass: null,
        onClick(){
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            disabled: this.props.disabled || false
        };
    }

    setDisabled(disabled) {
        this.setState({disabled});
    }

    handleClick = (e)=> {
        this.props.onClick(e, this.props.action, this);
    }

    render() {
        var {buttonClass, title, iconClass, onClick, label, ...props} = this.props;
        return <Button disabled={this.state.disabled}
                       onPress={this.handleClick} {...props}>
            {label}</Button>
    }
}
