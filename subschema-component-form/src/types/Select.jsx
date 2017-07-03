import React, { PureComponent } from 'react';
import PropTypes from 'subschema-prop-types';
import { isArray } from 'subschema-utils';

export default class Select extends PureComponent {


    static propTypes = {
        onBlur     : PropTypes.blurValidate,
        value      : PropTypes.value,
        id         : PropTypes.id,
        name       : PropTypes.htmlFor,
        className  : PropTypes.typeClass,
        fieldAttrs : PropTypes.fieldAttrs,
        options    : PropTypes.options,
        multiple   : PropTypes.bool,
        onChange   : PropTypes.valueEvent,
        placeholder: PropTypes.placeholder,
        onValidate : PropTypes.changeValidate
    };

    static defaultProps = {
        options : [],
        multiple: false,
        value   : ''
    };

    static injectedProps = {
        value: '.'
    };

    handleSelect = (e) => {
        let { multiple, placeholder } = this.props;
        if (multiple) {
            //normalize multiple  selection
            var values = [], options = e.target.options, i = 0,
                l                                          = options.length, option;
            for (; i < l; i++) {
                option = options[i];
                if (option.selected) {
                    if (option.label != placeholder) {
                        values.push(option.value);
                    }
                }
            }
            this.props.onChange(values);
            return
        } else if (e.target.value === placeholder) {
            this.props.onChange(null);
            return;
        }
        this.props.onChange(e.target.value);

    };

    renderOptions(value) {
        let { multiple, options, placeholder } = this.props;

        options      = options || [];
        let hasValue = false, ret = options.map(multiple ? (o, i) => {
            return <option key={'s' + i} value={o.val}>{o.label}</option>;
        } : (o, i) => {
            if (!hasValue && o.val + '' == value + '') {
                hasValue = true;
            }
            return <option key={'s' + i} value={o.val}>{o.label}</option>
        });

        if (placeholder) {
            ret.unshift(<option key={'null-' + options.length}>
                {placeholder}</option>);
        }
        return ret;
    }

    render() {
        let { onValidate, onChange, value, path, fieldAttrs = {}, options, ...props } = this.props;
        if (props.multiple && !isArray(value)) {
            value = value ? [value] : [];
        }
        return <select {...props} value={value} {...fieldAttrs}
                       onChange={this.handleSelect}>
            {this.renderOptions(value)}
        </select>
    }

}
