import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {PropTypes as NavTypes} from 'subschema-component-navigation';
import UninjectedSubschemaPlayground from '../../../subschema-component-playground/src/SubschemaPlayground.jsx';

export default class Example extends Component {

    static contextTypes = PropTypes.contextTypes;

    static propTypes = {
        example: PropTypes.string,
        SubschemaPlayground: PropTypes.injectClass,
        conf: PropTypes.any,
        useData: NavTypes.queryExists,
        useErrors: NavTypes.queryExists
    };

    static defaultProps = {
        SubschemaPlayground: UninjectedSubschemaPlayground,
        "useData": "useData",
        "useErrors": "useErrors"
    };

    render() {
        return <div>
            <h3>{this.props.example}</h3>
            <p>{this.props.conf && this.props.conf.description}</p>
            {this.renderEdit()}

        </div>
    }


    renderEdit() {
        const {SubschemaPlayground} = this.props;
        const conf = this.context.loader.loadSample(this.props.example);
        const {schema, setup, setupTxt, props, description, data, imports, errors} = conf || {};
        return <div className='sample-example-playground'>
            <SubschemaPlayground key={'form-' + this.props.example}
                                 theme='monokai'
                                 expandTxt="Show Example Code"
                                 collapseTxt="Hide Example Code"
                                 setupTxt={setupTxt}
                                 value={data}
                                 useData={this.props.useData}
                                 useErrors={this.props.useErrors}
                                 errors={errors}
                                 filename={`Example ${this.props.example}`}
                                 imports={imports}
                                 props={props}
                                 description={description}
                                 schema={schema}
                                 collapsableCode={true}
            />

        </div>
    }
}
