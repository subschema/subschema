"use strict";
import {PropTypes} from 'react';

export const injector = PropTypes.shape({
    inject: PropTypes.func.isRequired
});

export default {
    injector
};