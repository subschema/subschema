"use strict";

import React, {Component} from 'react';
import tu from '../tutils';
import css from '../css';
import field from '../decorators/field';
import template from '../decorators/template';

function compare(val, val2){
    if (val == null && val2 == null) {
        return true;
    }
    if (val == null || val2 == null) return false;
    return ('' + val === '' + val2);
}

@field
export default class RadioInput extends Component {
   static defaultProps = {
            title: '',
            name: '',
            placeholder: '',
            itemTemplate: 'RadioItemTemplate'
        }

    handleCheckChange = (e)=>{
        //Make a radio behave like a checkbox when there is only 1.
        if (this.props.forceSelection === false || this.props.options && this.props.options.length === 1) {
            this.triggerChange(compare(e.target.value, this.state.value) ? null : e.target.value);
        } else {
            this.triggerChange(e.target.value);
        }
    }

    makeOptions = (options)=>{
        options = options || [];
        var onChange = this.handleCheckChange;
        var value = this.state.value;
        var path = this.props.path;
        return options.map((option, index)=> {
            var {val, label, labelHTML} = tu.isString(option) ? {val: option, label: option} : option;
            if (val == null) {
                val = label;
            }
            if (label == null) {
                label = val;
            }
            var path = tu.path(path, index);

            return {
                val,
                path,
                label,
                labelHTML,
                onChange,
                checkedClass:this.props.checkedClass,
                checked: compare(value, val)
            }
        });
    }

    @template('itemTemplate')
    render(RadioItemTemplate)
    {
        var {name,itemTemplate,path, checkedClass, value, dataType,options, field} = this.props;
        var options = this.makeOptions(options);
        return <div className={css.forField(this)}>{options.map((option, index)=> {
            return <RadioItemTemplate checkedClass={checkedClass} {...option} key={option.path}>
                <input id={options.path} type="radio"
                       name={name} {...option} value={option.val}/>
            </RadioItemTemplate>
        }, this)}</div>

    }
}
