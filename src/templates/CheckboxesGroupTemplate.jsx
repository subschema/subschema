import React, {Component, PropTypes} from 'react';
import style from 'subschema-styles/CheckboxesGroupTemplate-style';


export default class CheckboxesGroupTemplate extends Component {
    static propTypes = {
        legend: PropTypes.node
    };

    render() {
        return (<fieldset className={style.group}>
            <legend>{this.props.legend}</legend>
            {this.props.children}
        </fieldset>);
    }
}
