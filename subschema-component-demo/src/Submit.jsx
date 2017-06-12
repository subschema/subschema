import React, { Component } from 'react';
import { Editor } from 'subschema-component-playground';

export default class Submit extends Component {

    static template = false;

    static defaultProps = {
        "theme": "monakai"
    };

    render() {
        return <div>
            <h3>Values</h3>
            <Editor
                key='value'
                className="playgroundStage"
                readOnly={true}
                codeText={JSON.stringify(this.props.value.value, null, 2)}
                theme={this.props.theme}
            />
            <h3>Errors</h3>
            <Editor
                key='error'
                className="playgroundStage"
                readOnly={true}
                codeText={JSON.stringify(this.props.value.error, null, 2)}
                theme={this.props.theme}
            />
        </div>
    }

}
