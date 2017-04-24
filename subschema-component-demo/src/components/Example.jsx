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
        useError: PropTypes.bool
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
        const {schema, setup, setupTxt, props, description, data, errors} =conf || {};
        const formProps = props || {};
        return <div className='sample-example-playground'>
            <SubschemaPlayground key={'form-' + this.props.example}
                                 theme='monokai'
                                 expandTxt="Show Example Code"
                                 collapseTxt="Hide Example Code"
                                 setupTxt={setupTxt}
                                 value={data}
                                 useData={this.props.useData}
                                 useError={this.props.useError}
                                 errors={errors}
                                 formProps={formProps}
                                 filename={`Example ${this.props.example}`}
                                 imports={Object.keys(formProps)}
                                 description={description}
                                 schema={schema}
                                 collapsableCode={true}
            />

        </div>
    }
}
