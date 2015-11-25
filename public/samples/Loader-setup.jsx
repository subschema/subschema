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

var {type} = Subschema.decorators.provide;
var {Checkbox, Select} = Subschema.types;

@type
class CheckboxSelect extends React.Component {

    //you can change the behaviour of onChange, but default it expects an event, otherwise
    // you can do as you want, this just returns the first arg.

    static eventValue = (v)=>v;

    constructor(...rest){
        super(...rest);
        //init state
        this.state = { disabled:false };
    }

    //Note: that functions are no longer bound by default to this, must use es6 binding for that
    handleCheck = (e)=>{
        this.setState({disabled:!e});
    }

    render(){
        var {className, ...props} = this.props;
        return <div className={className}>
            <Checkbox onChange={this.handleCheck} checked={this.state.disabled} />
            <Select {...props} disabled={this.state.disabled}/>
        </div>
    }
}


loader.addSchema({
    Address: {
        schema: {
            address: 'Text',
            city: 'Text',
            state: {
                type: 'CheckboxSelect',
                options: ['CA', 'FL', 'VA', 'IL']
            },
            zipCode: {
                type: 'Text',
                dataType: 'number'
            }
        },
        fields:['address', 'city', 'state', 'zipCode']
    },
    Contact: {
        schema: {
            name: 'Text',
            primary: {
                type: 'Object',
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
