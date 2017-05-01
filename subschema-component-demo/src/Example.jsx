import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {PropTypes as NavTypes} from 'subschema-component-navigation';
import {SubschemaPlayground as UninjectedSubschemaPlayground} from 'subschema-component-playground';

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
        SubschemaPlayground: UninjectedSubschemaPlayground
    };

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.conf = this.context.loader.loadSample(props.example);
    }

    componentWillReceiveProps(props) {
        if (this.props.example != props.example) {
            this.conf = this.context.loader.loadSample(props.example);
        }
    }

    render() {
        return <div>
            <h3>{this.props.example}</h3>
            <p>{this.props.conf && this.props.conf.description}</p>
            {this.renderEdit()}

        </div>
    }


    renderEdit() {
        const {SubschemaPlayground} = this.props;
        const {schema, setupTxt, props, description, data, imports, errors} = this.conf || {};
        return <div className='sample-example-playground'>
            <SubschemaPlayground key={'form-' + this.props.example}
                                 theme='monokai'
                                 expandTxt="Show Example Code"
                                 collapseTxt="Hide Example Code"
                                 filename={`Example ${this.props.example}`}
                                 useData={this.props.useData}
                                 useErrors={this.props.useErrors}
                                 collapsableCode={true}
                                 setupTxt={setupTxt}
                                 value={data}
                                 errors={errors}
                                 imports={imports}
                                 props={props}
                                 description={description}
                                 schema={schema}

            />

        </div>
    }
}
