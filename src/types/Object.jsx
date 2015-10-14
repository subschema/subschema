"use strict";
var React = require('../react');
var mixins = [require('../NestedMixin'), require('../BasicFieldMixin')];

var ObjectInput = React.createClass({
    mixins,
    getDefaultProps(){
        return {
            template: 'ObjectTemplate'
        }
    }

});
module.exports = ObjectInput;