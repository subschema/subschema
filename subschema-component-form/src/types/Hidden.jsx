import React, { PureComponent } from 'react';
import PropTypes from 'subschema-prop-types';

/**
 * Hidden does need a template, and does not care about errors.
 * but we will
 */
export default class Hidden extends PureComponent {
    static noTemplate = true;
    //only unnormal is asJSON, which will set the value to json rather than a
    // string so that it can be used to hold hidden state of complex
    // structures.
    static propTypes = {
        asJSON  : PropTypes.bool,
        onChange: PropTypes.targetEvent,
        value   : PropTypes.value
    };

    static template = false;

    static defaultProps = {
        type  : "hidden",
        asJSON: false
    };

    render() {
        const { value, asJSON, ...props } = this.props;
        return <input {...props}
                      value={asJSON && value !== void(0) ? JSON.stringify(value)
                          : value}/>
    }
}
