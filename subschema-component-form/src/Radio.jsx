"use strict";

import React, {Component} from "react";
import {path as tpath} from "../tutils";
import RenderTemplate from "../components/RenderTemplate";
import PropTypes from "../PropTypes";

function compare(val, val2) {
    if (val == null && val2 == null) {
        return true;
    }
    if (val == null || val2 == null) return false;
    return ('' + val === '' + val2);
}

export default class RadioInput extends Component {
    static inputClassName = '  ';


    static defaultProps = {
        itemTemplate: 'RadioItemTemplate',
        options: [],
        forceSelection: false
    };

    static propTypes = {
        onChange: PropTypes.valueEvent,
        itemTemplate: PropTypes.template,
        forceSelection: PropTypes.bool,
        checkedClass: PropTypes.cssClass,
        options: PropTypes.options.isRequired,
        path: PropTypes.path
    };


    handleCheckChange = (e)=> {
        //Make a radio behave like a checkbox when there is only 1.
        if (this.props.forceSelection === false || this.props.options && this.props.options.length === 1) {
            this.props.onChange(compare(e.target.value, this.props.value) ? null : e.target.value);
        } else {
            this.props.onChange(e.target.value);
        }
    };

    renderOptions(options) {
        options = options || [];
        const onChange = this.handleCheckChange;
        let {value, path, name, checkedClass} = this.props;
        name = name || path;
        return options.map((option, index)=> {
            const {val, label, labelHTML, ...rest} = option;
            const ret = {
                ...rest,
                id: tpath(path, index),
                name,
                checked: compare(value, val)
            };

            return <RenderTemplate key={`radio-item-${index}`} template={this.props.itemTemplate} {...ret}
                                   checkedClass={checkedClass} label={label || labelHTML}>
                <input type="radio" onChange={onChange} {...ret} value={val}/>
            </RenderTemplate>
        }, this);
    };

    render() {
        return <div className={this.props.className}>{this.renderOptions(this.props.options)}</div>

    }
}
