var FieldValueMixin = require('./FieldValueMixin'),
    WebValueEventMixin = require('./WebValueEventMixin');
var FieldMixin = {
    mixins: [WebValueEventMixin, FieldValueMixin],
    getInitialState(){
        return {
            value:this.props.value
        }
    }
};

module.exports = FieldMixin;