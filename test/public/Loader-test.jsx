import {React, into,TestUtils,expect, Simulate}  from '../support';

import Subschema from 'Subschema';

describe('Loader Example', ()=> {


    it('should load a custom type', ()=> {
        var {types, loaderFactory,DefaultLoader, Form, decorators} = Subschema;
        var {type} = decorators.provide;
        var {Select, Checkbox} = types;
        var loader = decorators.provide.defaultLoader = loaderFactory([DefaultLoader]);

        @type
        class CheckboxSelect extends React.Component {

            //allows for injection of the Select types.
            static propTypes = Select.propTypes;

            constructor(...rest) {
                super(...rest);
                //init state
                this.state = {disabled: false};
            }

            render() {
                var {className, ...props} = this.props;
                return <div className={className}>
                    <Checkbox onChange={(e)=>this.setState({disabled: !e})} checked={!this.state.disabled}/>
                    <Select {...props} disabled={this.state.disabled}/>
                </div>
            }
        }

        var schema = {
            schema: {
                'bases': {
                    type: 'CheckboxSelect',
                    placeholder:'Select a base',
                    options: 'first,second,third, home'
                }
            }
        }
        into(<Form schema={schema} loader={loader} />, true);

    });
});