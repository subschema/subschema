import {ValueManager, Form} from 'subschema';
import React from 'react';
import {into} from "subschema-test-support";

describe('Redux Example Usage', function () {
    this.timeout(50000);


    it('should have an example', function () {
        const createStore = (reducers, middleware)=> {
            const loggingReducer = (state = {}, action)=> {
                console.log('action', action);
                return reducers(state, action);
            };

            return ValueManager.createStore(loggingReducer, middleware);
        };
        const vm = ValueManager({}, {}, createStore);
        const store = vm.getStore();


        const f = into(<Form valueManager={vm} schema={{schema: {test: 'Text'}, fieldsets: [{fields: 'test', buttons: ['btn']}]}}/>, true)

    });

});