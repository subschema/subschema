import {loaderFactory, DefaultLoader, resolvers} from './subschema';
import React, {Component, PropTypes} from 'react';
import components from '@blueprintjs/core/dist/components/index';
import '@blueprintjs/datetime/dist/blueprint-datetime.css';
import {DateInput} from "@blueprintjs/datetime";

DateInput.injectedPropTypes = {"onChange": "valueEvent"};

const loader = loaderFactory([DefaultLoader]);

const {Dialog, Collapse, ...types} = components;

Dialog.injectedPropTypes = {onClose: 'toggleEvent', isOpen: 'toggle'};
loader.addTemplate({Dialog, Collapse});

loader.addType(types);

loader.addType({DateInput});

loader.addStyle({
    EditorTemplate: {
        field: 'pt-control-group',
        label: "pt-label",
        error: 'error-block help-block',
        help: 'help-block',
        hasError: 'has-error',
        hasTitle: "col-sm-10",
        noTitle: "col-sm-12"
    },
    ButtonsTemplate: {
        buttons: ' ',
        button: 'pt-button',
        buttonContainer: ' ',
        primary: 'pt-intent-primary'
    }
});

class Icon extends Component {
    static propTypes = {
        icon: PropTypes.string
    };
    static defaultProps = {
        icon: ''
    };

    render() {
        return <div className="pt-input-group pt-large">
            <span className={`pt-icon ${this.props.icon}`}></span>
            {this.props.children}
        </div>

    }
}

loader.addTemplate({Icon});

resolvers.typeClass.settings.inputClassName = 'pt-input';

export default loader;