"use strict";

import React, {Component} from './React';
import PropTypes from './PropTypes';
import ValueManager from './ValueManager';

export default class NewChildContext extends Component {
    static propTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        path: PropTypes.string.isRequired
    }
    static childContextTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        parentValueManager: PropTypes.valueManager
    }

    getChildContext() {
        var parentValueManager = this.props.valueManager;
        var valueManager = this.valueManager = ValueManager(parentValueManager.getValue(), parentValueManager.getErrors());
        this._submit = parentValueManager.addSubmitListener(null, this.handleSubmit, this, false);
        return {valueManager, parentValueManager, loader: this.props.loader};
    }

    componentWillUnmount() {
        this._submit && this._submit.remove();
    }

    handleSubmit(e) {
        //t(e, vm.getErrors(), vm.getValue(), this.props.path)
        var value = this.valueManager.path(this.props.path), errors = this.valueManager.getErrors();

        if (this.props.onSubmit) {
            if (this.props.onSubmit(e, errors, value, this.props.path) !== false) {
                this.props.valueManager.update(this.props.path, value);
            }
        } else {
            this.props.valueManager.update(this.props.path, value);
        }
        return false;
    }


    render() {
        return React.cloneElement(this.props.children, {onSubmit: this.handleSubmit});
    }
}
