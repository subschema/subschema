var FieldValueMixin = {
    mixins: [require('./BasicFieldMixin'), require('./FieldValueDefaultPropsMixin'), require('./FieldStateMixin'), require('./FieldHandleValueMixin')],
};
module.exports = FieldValueMixin;