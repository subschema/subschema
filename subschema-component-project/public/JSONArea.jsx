"use strict";
import React, {Component} from 'react';
import {PropTypes} from 'Subschema';


export default class JSONArea extends Component {
    static propTypes = {
        onChange: PropTypes.valueEvent
    };

    constructor(...args) {
        super(...args);
        this.state = {};
    }

    commitChange = e=> {
        var value = e.target.value;
        try {
            var obj = JSON.parse(value);
            this.state.error = null;
            this.state.value = value;
            this.props.onChange(obj);
        } catch (err) {
            this.setState({error: err.message, value});
        }
    };
    /**
     * //TODO - Keep cursor position so that JSON.stringify works correctly. Find a better component.
     * Commit on blur, otherwise cursor focus gets screwey
     **/
    handleChange = e => {
        var {value}= e.target;
        var ovalue = value;
        var error;
        try {
            value = JSON.parse(value);
        } catch (err) {
            value = ovalue;
            error = err.message
        }
        this.setState({value, error});
    };

    render() {
        var {value, onChange, ...props} = this.props;
        var {error} = this.state;
        if (error) {
            if (this.state.value != null)
                value = this.state.value;
        } else {
            if (value != null)
                value = JSON.stringify(value, null, 3);
        }
        return <div>
            <textarea {...props} onChange={this.handleChange} onBlur={this.commitChange} value={value}/>
            {error ? <span className="has-error">{error}</span> : null }
        </div>
    }
}