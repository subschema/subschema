import {PropTypes} from 'prop-types';

export const injector = PropTypes.shape({
    inject: PropTypes.func.isRequired
});

export default {
    injector
};