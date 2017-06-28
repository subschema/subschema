import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import { extractFields } from 'subschema-core/lib/resolvers/stash';

function resolveFieldKey(key) {
    return (this.path && key != null) ? `${this.path}.${key}` : key;
}

/**
 * StashableMixin - Gives a component access to the
 * stash API.   This allows for form resets and cancel
 * events.
 */
export default class StashableMixin extends Component {

    static propTypes    = {
        path            : PropTypes.path,
        stash           : PropTypes.stash,
        unstashOnUnmount: PropTypes.unstash,
        clearStash      : PropTypes.clearStash,
        validate        : PropTypes.validateFields
    };

    static defaultProps = {
        unstashOnUnmount: true
    };

    validate() {
        return this.props.validate();
    }

    clearStash() {
        this.props.clearStash();
    }

    unstash() {
        this.props.unstashOnUnmount();
    }

    stash() {
        this.props.stash();
    }

}
