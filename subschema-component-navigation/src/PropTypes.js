import PropTypes from 'subschema-prop-types';

export const location = PropTypes.shape({
    pathname: PropTypes.string,
    search  : PropTypes.string,
    hash    : PropTypes.string
});
export const history  = PropTypes.shape({
    listen   : PropTypes.func,
    push     : PropTypes.func,
    replace  : PropTypes.func,
    go       : PropTypes.func,
    goForward: PropTypes.func,
    goBack   : PropTypes.func,
    location
});

export default ({ location, history });
