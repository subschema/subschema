import React, {Component} from 'react';
import PropTypes from '../PropTypes';

export default class CheckboxesGroupTemplate extends Component {
    static propTypes = {
        legend: PropTypes.node,
        style: PropTypes.style
    };

    render() {
        return (<fieldset className={this.props.groupClass}>
            <legend>{this.props.legend}</legend>
            {this.props.children}
        </fieldset>);
    }
}
