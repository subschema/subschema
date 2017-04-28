import React, {Component} from "react";
import {Editor} from "subschema-component-project";

export default class Submit extends Component {

    static template = false;
    
    static defaultProps = {
        "theme": "monakai"
    };

    render() {
        return <Editor
            className="playgroundStage"
            readOnly={true}
            codeText={JSON.stringify(this.props.value, null, 2)}
            theme={this.props.theme}
        />
    }

}