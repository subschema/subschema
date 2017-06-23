import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import { flattenFields } from 'subschema-utils';
function resolveFieldKey(key) {
    return (this.path && key != null) ? `${this.path}.${key}` : key;
}
/**
 * StashableMixin - Gives a component access to the
 * stash API.   This allows for form resets and cancel
 * events.
 */
export default class StashableMixin extends Component {
    static contextTypes = {
        valueManager: PropTypes.valueManager
    };
    static propTypes    = {
        fields          : PropTypes.fields,
        path            : PropTypes.path,
        //If the component goes away do we unstash (restore values) or
        // clearStash
        unstashOnUnmount: PropTypes.bool
    };

    static defaultProps = {
        unstashOnUnmount: true
    };

    componentDidMount() {
        this.stash();
    }

    componentWillUnmount() {

        if (this.props.unstashOnUnmount) {
            this.unstash();
        } else {
            this.clearStash();
        }
    }

    validate() {
        const fields = flattenFields(this.props)
            .map(resolveFieldKey, this.props);
        return this.context.valueManager.validatePaths(fields);
    }

    clearStash() {
        this.context.valueManager.clearStash(this.props.path || this);
    }

    unstash() {
        this.context.valueManager.unstash(this.props.path || this);
    }

    stash(f) {
        const fields = f || flattenFields(this.props)
                .map(resolveFieldKey, this.props);
        this.context.valueManager.stash(this.props.path || this, fields);
    }

}
