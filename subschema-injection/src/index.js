"use strict";
import {PropTypes as ReactPropTypes} from 'react';
import injector from './injector';
import injF from './injectorFactory';
import ut from './util';

export const util = ut;

export const injectorFactory = injF;

export const PropTypes = {
    injector: ReactPropTypes.shape({
        inject: ReactPropTypes.func.isRequired
    })
};

export default injector;
