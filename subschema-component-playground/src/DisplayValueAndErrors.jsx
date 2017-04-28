import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';

/**
 * This class is used to display errors and or values.
 */
function stringify(obj) {
    return JSON.stringify(obj, null, 2);
}
export default class DisplayValueAndErrors extends Component {
    static propTypes = {
        value: PropTypes.value,
        errors: PropTypes.errors
    };


    render() {
        return <div className="form-group">
            <h3>Values:</h3>
 <pre className='value-manager-node-value'>
 {stringify(this.props.value)}
 </pre>
            <h3>Errors:</h3>
 <pre className='value-manager-node-error'>
 {this.props.errors ? stringify(this.props.errors) : 'No Errors.'}
 </pre>

        </div>
    }
}