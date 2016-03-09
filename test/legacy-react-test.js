import React from 'react';
import expect from 'expect';
import {newSubschemaContext, PropTypes, Form} from 'Subschema';
import { byName, into,findNode, TestUtils, filterProp, byClass,Simulate, click, byTag, byTags,  byComponent, byComponents} from 'subschema-test-support';

/**
 * Ensure that subschema works with oldstyle react class's.
 */
describe('legacy-react-test', function () {

    const Legacy = React.createClass({
        propTypes: {
            expression: PropTypes.expression
        },

        render(){
            return <div>{this.props.expression}</div>
        }
    });


    it('should render legacy components', function () {
        const Subschema = newSubschemaContext();
        const {loader} = Subschema;
        loader.addType({Legacy});

        const form = into(<Form value={ {name:'Hello'} } schema={{
            legacy:{
                type:"Legacy",
                expression:"{name}"
            }
        }} loader={loader}/>);
        expect(form).toExist();
        const legacy = byComponent(form, Legacy);
        const dom = findNode(legacy);
        expect(dom.innerHTML).toBe('Hello');

    })
});