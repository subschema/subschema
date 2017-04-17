import React, {Component} from "react";

export default class NavTemplate extends Component {
    static defaultProps = {
        brandText: "Subschema",
        content: ''
    };

    render() {
        return (<nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="#">{ this.props.content || this.props.brandText}</a>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-right">
                        {this.props.children}
                    </ul>
                </div>
            </div>
        </nav>);
    }
}