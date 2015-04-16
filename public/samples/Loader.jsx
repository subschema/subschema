var React = require('react');
module.exports = {
    description: '<p>This shows how to use a loader to load a schema</p><p>It can be used to load Templates, Processors, Types, Schemas and Validators. Here we are demonstrating templates and schemas, but the same pattern applies to the other types </p>',
    schema: 'Contact',
    data: {
        name: 'Robert Loblaw',
        primary: {
            address: '123 Main St',
            city: 'San Jose',
            state: 'CA'
        },
        otherAddresses: [
            {
                address: '456 2nd St',
                city: 'Chicago',
                state: 'IL'
            },
            {
                address: '3232 Fillmore St',
                city: 'Arlington',
                state: 'VA'
            }
        ]
    },
    errors: {
        'primary.address': [{message: 'No Such Place'}]
    },
    unsetup: function (l) {
        var loader = require('subschema').loader;
        loader.removeLoader(l);
    },
    setup: function () {
        var loader = require('subschema').loader;
        /**
         * If you are using a jsx compiler you would just
         * use jsx, but due to things, its not jsx.
         */
        loader.addTemplate('SimpleTemplate', React.createClass({
            displayName: 'SimpleTemplate',
            render(){
                var {name, title, help, errorClassName, message, fieldClass, children} = this.props;
                return (<div
                    className={"form-group field-name " + (message != null ? errorClassName : '') + ' ' +  fieldClass}>
                    <div className="">
                        {children}
                        <p className="help-block" ref="help">{message || help}</p>
                    </div>
                </div>);
            }
        }));
        var Object = require('subschema').Types.Object;
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

                return <div className="form-group row">
                    <legend onClick={this.handleToggle}>Toggle {this.state.toggled ? 'Up' : 'Down'}</legend>
                    <div style={style}>
                        <Object ref="val" {...this.props}/>
                    </div>
                </div>;

            }
        }));
        var loaded = loader.addSchema({
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
        return loaded;
    }
}