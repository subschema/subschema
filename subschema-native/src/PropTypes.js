import PropTypes from 'subschema-prop-types';
import ReactTypes from 'prop-types';

export const onSubmitEditing = PropTypes.customPropType(PropTypes.func, 'onSubmitEditing');
export const style = PropTypes.style;

const _styleClass = ReactTypes.oneOfType([ReactTypes.object, ReactTypes.number, ReactTypes.string]);
export const styleClass = ReactTypes.oneOfType([_styleClass, ReactTypes.arrayOf(_styleClass)]);

export default ({
    style,
    onSubmitEditing,
    styleClass
});