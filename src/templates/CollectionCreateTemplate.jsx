var React = require('react');
var Editor = require('../Editor.jsx');

var CollectionCreateTemplate = React.createClass({
    render(){
        return (<div className="panel panel-default">
            <div className="panel-heading">
                <h3 className={ 'panel-title clearfix '}>
                    {this.props.title}
                </h3>
            </div>
            <div className="panel-body">
                <div className="form-group">
                    <Editor ref="itemEditor" field={this.props.field} value={this.props.value}
                            valueManager={this.props.valueManager}
                            pid={this.props.editPid}
                            form={null}/>
                </div>
                <div className="form-group">
                    <button className="btn btn-default pull-left" ref="cancelBtn" onClick={this.props.onCancel}>Cancel
                    </button>
                    <button className="btn btn-primary pull-right" ref='submitBtn'
                            onClick={this.props.onSubmit}>{this.props.submitButton}</button>
                </div>
            </div>
        </div>);
    }
});
module.exports = CollectionCreateTemplate;

