
loader.addTemplate('SimpleTemplate', React.createClass({
    displayName: 'SimpleTemplate',
    render(){
        var {name, title, help, errorClassName, message, fieldClass, children} = this.props;
        return (<div
            className={"form-group field-name " + (message != null ? errorClassName : '') + ' ' +  fieldClass}>
            <div className="col-sm-offset-1 col-sm-10">
                {children}
                <p className="help-block" ref="help">{message || help}</p>
            </div>
        </div>);
    }
}));

var ObjectType = loader.loadType('Object');

loader.addType('ToggleObject', React.createClass({
    displayName: 'ToggleObject',
    getInitialState(){
        return {
            toggled: false
        }
    },
    handleToggle(){
        this.setState({toggled: !this.state.toggled});
    },
    getValue(){
        return this.refs.val.getValue()
    },
    setValue(val){
        this.refs.val.setValue(val);
    },
    render(){
        var style = {
            display: this.state.toggled ? 'none' : 'block'
        };

        return <div className="form-group">
            <legend onClick={this.handleToggle}>Toggle {this.state.toggled ? 'Up' : 'Down'}</legend>
            <div style={style}>
                <ObjectType ref="val" {...this.props}/>
            </div>
        </div>;

    }
}));

loader.addSchema({
    Address: {
        address: 'Text',
        city: 'Text',
        state: {
            type: 'Select',
            options: ['CA', 'FL', 'VA', 'IL']
        },
        zipCode: {
            type: 'Text',
            dataType: 'number'
        }
    },
    Contact: {
        schema: {
            name: 'Text',
            primary: {
                type: 'ToggleObject',
                subSchema: 'Address',
                template: 'SimpleTemplate'
            },
            otherAddresses: {
                canEdit: true,
                canReorder: true,
                canDelete: true,
                canAdd: true,
                type: 'List',
                labelKey: 'address',
                itemType: {
                    type: 'Object',
                    subSchema: 'Address'
                }
            }
        },
        fields: ['name', 'primary', 'otherAddresses']
    }
});
