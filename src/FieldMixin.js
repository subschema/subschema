var tu = require('./tutils'), BasicFieldMixin = require('./BasicFieldMixin'),
    FieldValueMixin = require('./FieldValueMixin'),
    WebValueEventMixin = require('./WebValueEventMixin');
var FieldMixin = tu.extend({}, BasicFieldMixin, WebValueEventMixin, FieldValueMixin);

module.exports = FieldMixin;