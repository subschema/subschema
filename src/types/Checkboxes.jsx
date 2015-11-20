"use strict";

import React, {Component} from 'react'
import tu from '../tutils'
import Constants from '../Constants'
import css from '../css'
import PropTypes from '../PropTypes'
import field from '../decorators/field';
import template from '../decorators/template';

@field(null, 'handleCheckChange')
export default class Checkboxes extends Component {
    static      inputClassName = Constants.inputCheckboxesClassNam

    static propTypes = {
        options: PropTypes.options,
        itemTemplate: PropTypes.template,
        groupTemplate: PropTypes.template
    }

    static defaultProps = {
        title: '',
        name: '',
        placeholder: '',
        dataType: this.dataType,
        options: [],
        itemTemplate: 'CheckboxesTemplate',
        groupTemplate: 'CheckboxesGroupTemplate'
    }

    handleCheckChange(e) {
        var newValues = this.state.value || [];
        if (e.target.checked) {
            newValues.push(e.target.value);
        } else {
            newValues.splice(newValues.indexOf(e.target.value), 1);
        }
        this.triggerChange(newValues);
    }


    _createCheckbox(option, index, group, CheckboxTemplate) {


        var id = tu.path(this.props.path, index, group);
        var {val, labelHTML} = option;
        var value = this.state.value;
        var labelContent = labelHTML ? <span dangerouslySetInnerHTML={{__html:labelHTML}}/> : val;
        var opts = {
            onChange: this.handleCheckChange,
            name: this.props.name,
            checked: value ? !!~value.indexOf(val) : false,
            ref: id.replace(/\./g, '_'),
            id,
            value: val
        }
        return (<CheckboxTemplate label={labelContent} {...opts}>
            <input type="checkbox" {...opts}/>
        </CheckboxTemplate>);

    }

    _createGroup(option, index, group, Template, CheckboxTemplate) {
        return <Template group={option.group}>
            {this.makeOptions(option.options, group == null ? 0 : group, CheckboxTemplate)}
        </Template>

    }


    /**
     * Create the checkbox list HTML
     * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
     * @return {String} HTML
     */
    @template('itemTemplate', 'groupTemplate')
    makeOptions(CheckboxTemplate, CheckboxesGroupTemplate, array, group) {
        array = array || [];
        var name = this.props.name;
        return array.map((option, index)=> {
            option = tu.isString(option) ? {val: option} : option;
            return (
                <div
                    key={name+'-'+option.val+'-'+group}>{ option.group ? this._createGroup(option, index, group ? group++ : 0, CheckboxesGroupTemplate, CheckboxTemplate) : this._createCheckbox(option, index, group, CheckboxTemplate)}</div>)

        });
    }

    render() {

        return <div
            className={css.forField(this)}>{this.makeOptions(this.props.options, 1)}</div>
    }
}
