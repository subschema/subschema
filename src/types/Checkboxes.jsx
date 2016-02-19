"use strict";

import React, {Component} from 'react'
import Constants from '../Constants'
import PropTypes from '../PropTypes'
import tu, {path, toArray, FREEZE_ARR,returnFirst,  isArray} from '../tutils';

export default class Checkboxes extends Component {
    //override added input Class Names.
    static inputClassName = ' ';

    static propTypes = {
        onChange: PropTypes.valueEvent,
        options: PropTypes.options,
        item:PropTypes.type,
        itemTemplate: PropTypes.template,
        groupTemplate: PropTypes.template,

    };

    static defaultProps = {
        options: FREEZE_ARR,
        item:'Checkbox',
        itemTemplate: 'CheckboxesTemplate',
        groupTemplate: 'CheckboxesGroupTemplate',
        //make the value an array regardless of input
        value: {
            processor: toArray
        }
    };



    handleCheckChange = (e)=> {
        var newValues = this.props.value.concat();
        if (e.target.checked) {
            newValues.push(e.target.value);
        } else {
            newValues.splice(newValues.indexOf(e.target.value), 1);
        }

        this.props.onChange(newValues);
    };


    _createCheckbox(option, index, group, CheckboxTemplate) {


        var id = path(this.props.path, index, group);
        var {val, labelHTML, label} = option;
        label = labelHTML || label;
        var value = this.props.value;
        var labelContent = label ? <span dangerouslySetInnerHTML={{__html:label}}/> : val;
        var opts = {
         //   onChange: this::this.handleCheckChange,
            name: group,
            checked: value ? !!~value.indexOf(val) : false,
            id,
            path:id,
            value: val
        };
        const Checkbox = this.props.item;
        return (<CheckboxTemplate label={labelContent} {...opts}>
            <Checkbox {...opts}/>
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
    makeOptions(array, group) {
        array = array || FREEZE_ARR;
        var name = this.props.name;
        const CheckboxTemplate = this.props.itemTemplate;
        const CheckboxesGroupTemplate = this.props.groupTemplate;
        return array.map((option, index)=> {
            return (
                <div
                    key={`${name}-${index}-${group}`}>{ option.group ? this._createGroup(option, index, group ? group++ : 0, CheckboxesGroupTemplate, CheckboxTemplate)
                    : this._createCheckbox(option, index, group, CheckboxTemplate)}</div>)

        });
    }

    render() {

        return <div
            className={this.props.className}>{this.makeOptions(this.props.options, this.props.name)}</div>
    }
}
