"use strict";
import React, {Component} from 'react';
import PropTypes from './../PropTypes';
import CSSTransitionGroup  from 'react-addons-css-transition-group';
import listeners from './../decorators/listeners';
import {FREEZE_OBJ} from '../tutils';

var opRe = /^(==|===|!=|!==|>=|>|truthy|falsey|<|<=|(\!)?\/(.*)\/([gimy])?)$/;

var opFactory = (function opFactory$factory(scope) {
    var eq = function (compare, value) {
        return value == compare
    }, eqeq = function (compare, value) {
        return value === compare
    }, ne = function (compare, value) {
        return value != compare
    }, neeq = function (compare, value) {
        return value !== compare
    }, gt = function (compare, value) {
        return value > compare
    }, gteq = function (compare, value) {
        return value >= compare
    }, lt = function (compare, value) {
        return value < compare
    }, lteq = function (compare, value) {
        return value <= compare
    }, truthy = function (compare) {
        return !!compare;
    }, falsey = function (compare) {
        return !compare;
    };
    return (operator)=> {
        switch (operator) {
            case 'truthy':
                return truthy;
            case 'falsey':
                return falsey;
            case '==':
                return eq;
            case '===':
                return eqeq;
            case '!=':
                return ne;
            case '!==':
                return neeq;
            case '>':
                return gt;
            case '>=':
                return gteq;
            case '<':
                return lt
            case '<=':
                return lteq;

            default:
            {
                throw new Error('Unknown operator [' + operator + ']')
            }
        }
    }
}());

export default class Conditional extends Component {
    static contextTypes = PropTypes.contextTypes;

    static defaultProps = {
        operator: '!=',
        value: null,
        animate: false
    }

    static propTypes = {
        path: PropTypes.path,
        /**
         * The value  to use too compare against  if not given, than
         * it will be a compare against null.
         */
        value: PropTypes.any,
        /**
         * The path to listen to can be empty,
         * in which case will look for
         * defaults to the current path.
         */
        listen: PropTypes.path,

        /**
         * The template to use if it evaluates to true
         * IE - Modal, ShowHide
         */
        template: PropTypes.template,
        /**
         * The template to use if it evaluates to false
         * defaults to a null span
         */
        falseTemplate: PropTypes.template,
        /**
         * A string to use  a named animation,or a boolean.
         *
         * if a string that string will be the "name" to use to animate.
         * If an object is passed than it will passed as props to the transition group.
         * If === true than the default animation will be used.
         * If === false than no animation is used
         *
         */
        animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object]),
        /**
         * How to compare the value to the matched value.
         * If ommitted and a value is given than === is used.
         * If ommitted and the value is ommitted than a !(value == null) is used.
         *
         */
        operator: PropTypes.operator,
        /**
         * Listen to an error rather than the mutually exclusive with listen.
         */
        error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    }

    constructor(props, ...rest) {
        super(props, ...rest);
        this._handleProps(FREEZE_OBJ, props);
    }

    componentWillReceiveProps(props) {
        this._handleProps(this.props, props);
        this.listeners(props);
        this.errorListeners(props);
    }


    @listeners
    listeners(props) {
        props = props || this.props;
        var {listen, error,path} = props;
        if (listen === false) {
            return;
        }
        if (listen || error == null) {
            var key = listen == null || listen === true ? path : listen;
            this._key = '@' + key.replace(/\./g, '_');
            return {
                [key]: this.handleValue,
                [this._key]: [this.handleMatch, false]

            }
        }
    }


    handleMatch = (value)=> {
        this.setState({matched: value});
    }

    @listeners('error')
    errorListeners(props) {
        var props = props || this.props;
        var {error, path} = props;
        if (error) {
            return {
                [error === true ? path : error]: this.handleValue
            }
        }
    }


    _handleProps(oldProps, props) {
        if (oldProps.template != props.template) {
            if (props.template !== false) {
                if (typeof props.template === 'string') {
                    this.Template = this.context.loader.loadTemplate(props.template);
                } else {
                    this.Template = props.template;
                }
            }
        }
        if (oldProps.falseTemplate != props.falseTemplate) {
            if (typeof props.falseTemplate === 'string') {
                this.FalseTemplate = this.context.loader.loadTemplate(props.falseTemplate);
            }
        }
        if (oldProps.operator != props.operator) {
            this.evaluate = this.compile(props.operator);
            //  this.handleValue(this.state && this.state.value);
        }
    }

    handleValue = (value)=> {
        var matched = this.evaluate(value, this.props.value);
        this.setState({matched});
    }


    compile(operator) {
        if (operator instanceof RegExp) {
            return (compare, value) =>operator.test(compare, value);
        }
        if (typeof operator === 'function') {
            return operator;
        }
        if (typeof operator === 'string') {
            var os = opRe.exec(operator);
            if (os) {
                if (os[3] != null) {
                    operator = new RegExp(os[3], os[4]);
                    if (os[2] == null) {
                        return (compare, value) => operator.test(compare);
                    } else {
                        return (compare, value) => !operator.test(compare);
                    }
                }
                return opFactory(operator);
            } else {
                return this.context.loader.loadOperator(operator)(this.props);
            }
        }


    }

    renderTemplate() {
        var Template = this.Template;
        var {value,  template, falseTemplate, operator, animate,children, ...props} = this.props;
        return Template ?
            <Template key='true-conditional' dismiss={this._key} {...props}
            >{this.props.children}</Template> : children;
    }

    renderFalseTemplate() {
        var FalseTemplate = this.FalseTemplate;
        var {value, listen, error, template, falseTemplate, operator, animate, ...props} = this.props;
        return FalseTemplate ? <FalseTemplate
            key='false-conditional' {...props}
        >{this.props.children}</FalseTemplate> : null;
    }

    renderContent() {
        return this.state.matched ? this.renderTemplate() : this.renderFalseTemplate();

    }


    render() {
        if (!this.props.animate) {

            return this.renderContent();
        }

        if (typeof this.props.animate === 'string') {
            return <CSSTransitionGroup name={this.props.animate}>
                {this.renderContent()}
            </CSSTransitionGroup>
        }
        return <CSSTransitionGroup {...this.props.animate}>
            {this.renderContent()}
        </CSSTransitionGroup>

    }
}
