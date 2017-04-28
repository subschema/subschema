"use strict";
import React from 'react';
import {into} from 'subschema-test-support';
import {ValueManager} from "subschema/lib/index";
import Example from '../src/components/Example';


describe('components/Example', function(){
    it('should render', function(){
        into(<Example example="Basic"/>,  true);
    })

});