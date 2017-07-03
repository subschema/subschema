import React, { PureComponent } from 'react';
import PropTypes from 'subschema-prop-types';

export default class DateInput extends PureComponent {

    static propTypes = {
        onBlur     : PropTypes.blurValidate,
        value      : PropTypes.value,
        id         : PropTypes.id,
        name       : PropTypes.htmlFor,
        className  : PropTypes.typeClass,
        placeholder: PropTypes.string,
        dataType   : PropTypes.string,
        fieldAttrs : PropTypes.fieldAttrs,
        onChange   : PropTypes.valueEvent
    };

    static defaultProps = {
        type: "date"
    };

    asInputValue(value) {
        if (!value) {
            return '';
        }
        return new Date(value).toISOString().substring(0, 10);
    }


    handleDateChange = (e) => {
        var value = e.target.value;
        this.props.onChange(new Date(value).getTime());
    };


    render() {
        var { value, onChange, ...props } = this.props;
        return <input {...props} onChange={this.handleDateChange}
                      value={this.asInputValue(value)}/>
    }
}
