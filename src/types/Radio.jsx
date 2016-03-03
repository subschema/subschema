"use strict";

import React, {Component} from 'react';
import {returnFirst, path as tpath} from '../tutils';

import PropTypes from '../PropTypes';

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
        options: PropTypes.options.isRequired
    };


    handleCheckChange(e) {
        //Make a radio behave like a checkbox when there is only 1.
        if (this.props.forceSelection === false || this.props.options && this.props.options.length === 1) {
            this.props.onChange(compare(e.target.value, this.props.value) ? null : e.target.value);
        } else {
            this.props.onChange(e.target.value);
        }
    };

    makeOptions(options){
        options = options || [];
        const onChange = this::this.handleCheckChange;
        const value = this.props.value;
        const path = this.props.path;
        return options.map((option, index)=> {
            var {val, label, labelHTML} = option;
            var path = tpath(path, index);
            return {
                val,
                path,
                label,
                onChange,
                checkedClass: this.props.checkedClass,
                checked: compare(value, val)
            }
        });
    };

    render() {
        var {name,itemTemplate,className, checkedClass, value, options, field} = this.props;
        var options = this.makeOptions(options);
        var RadioItemTemplate = itemTemplate;
        return <div className={className}>{options.map((option, index)=> {
            const id = options.id || `${name}.${index}`
            return <RadioItemTemplate id={id} checkedClass={checkedClass} {...option} key={option.path}>
                <input id={id} type="radio"
                       name={name} {...option} value={option.val}/>
            </RadioItemTemplate>
        }, this)}</div>

    }
}
