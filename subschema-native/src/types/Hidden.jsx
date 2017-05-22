import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';

export default class Hidden extends Component {
    static noTemplate = true;
    //only unnormal is asJSON, which will set the value to json rather than a string
    // so that it can be used to hold hidden state of complex structures.
    static propTypes = {
        asJSON: PropTypes.bool
    };

    static template = false;

    static defaultProps = {
        type: "hidden",
        asJSON: false
    };
    render(){
        return null;
    }
}