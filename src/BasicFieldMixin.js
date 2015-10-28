"use strict";
var {FREEZE_OBJ} = require('./tutils');
var BasicFieldMixin = {
    componentWillMount(){
        this.subschemaPropUpdate(this.props, FREEZE_OBJ);
    },
    componentWillUnmount(){
        if (this.__listener) {
            this.__listener.remove();
        }
    },
    componentWillReceiveProps(newProps){
        this.subschemaPropUpdate(newProps, this.props);
    },
    subschemaPropUpdate(props, oldProps){
        if (!props.valueManager || props.valueManager === oldProps.valueManager && props.path === oldProps.path) {
            return;
        }
        if (this.__listener) {
            this.__listener.remove();
        }
        this.__listener = props.valueManager.addListener(props.path, this.setValue, this, true);
    },
    triggerChange(value){
        if (!this.props.valueManager) {
            return this.props.onValueChange(value);
        }
        if (this.props.valueManager.update(this.props.path, value) !== false) {
            return this.props.onValueChange(value);
        }
    },
    getDefaultProps(){
        return {
            onValueChange(value)
            {
            }
        }
    }
};

module.exports = BasicFieldMixin;