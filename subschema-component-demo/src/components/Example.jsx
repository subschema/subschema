import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import UninjectedSubschemaPlayground from './SubschemaPlayground.jsx';

export default class Example extends Component {

    static contextTypes = PropTypes.contextTypes;

    static propTypes = {
        example: PropTypes.string,
        SubschemaPlayground: PropTypes.injectClass,
        conf: PropTypes.any,
        useData: PropTypes.bool,
        useErrors: PropTypes.bool
    };
    static defaultProps = {
        SubschemaPlayground: UninjectedSubschemaPlayground
    };

    render() {
        return <div>
            <h3>{this.props.example}</h3>
            <p>{this.props.conf && this.props.conf.description}</p>
            {this.renderEdit()}

        </div>
    }


    renderEdit() {
        const {SubschemaPlayground, conf} = this.props;
        const {schema, setup, setupTxt, props, description, data, imports, errors} =conf || {};
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
