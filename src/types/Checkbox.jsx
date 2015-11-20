import React, {Component} from 'react';
import Constants from '../Constants';
import css from '../css';
import field from '../decorators/field';

@field
export default class Checkbox extends Component {
    static inputClassName = ''//Constants.inputClassName,

    handleChange = (e)=> {
        var hasProp = 'value' in this.props;
        this.triggerChange(e.target.checked ? hasProp ? this.props.value : true : hasProp ? null : false);
    }

    render() {
        var {onValueChange, onChange,value, type, dataType, checkedClass, fieldAttrs, className, onBlur, ...props} = this.props;
        dataType = dataType || 'checkbox';
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={ (this.state.value ? checkedClass || '' : '' )+' '+css.forField(this)}
                      checked={this.state.value}
                      type={dataType}
            {...props}
            {...fieldAttrs}
        />
    }
}
