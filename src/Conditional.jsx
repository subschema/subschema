"use strict";
var React = require('react');
var PropTypes = React.PropTypes;
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var opRe = /^(==|===|!=|!==|>=|>|truthy|falsey|<|<=|(\!)?\/(.*)\/([gimy])?)$/;

var opFactory = (function opFactory$factory(scope) {
    var eq = function (compare) {
        return this.props.value == compare
    }, eqeq = function (compare) {
        return this.props.value === compare
    }, ne = function (compare) {
        return this.props.value != compare
    }, neeq = function (compare) {
        return this.props.value !== compare
    }, gt = function (compare) {
        return this.props.value > compare
    }, gteq = function (compare) {
        return this.props.value >= compare
    }, lt = function (compare) {
        return this.props.value < compare
    }, lteq = function (compare) {
        return this.props.value <= compare
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

var Conditional = React.createClass({
    mixins: [require('./ValueManagerListenerMixin')],
    propTypes: {
        /**
         * The value to listen to can if not given, than
         * it will be a compare against not null.
         */
        value: PropTypes.any,
        /**
         * The path to listen to can be empty,
         * in which case will look for
         * defaults to the current path.
         */
        listen: PropTypes.string,

        /**
         * The template to use if it evaluates to true
         * IE - Modal, ShowHide
         */
        template: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        /**
         * The template to use if it evaluates to false
         * defaults to a null span
         */
        falseTemplate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.func]),
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
        operator: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.instanceOf(RegExp)]),
        /**
         * Listen to an error rather than the mutually exclusive with listen.
         */
        error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    },
    componentWillReceiveProps(props){
        this._handleProps(this.props, props);
    },

    getInitialState(){
        return {}
    },
    getDefaultProps(){
        return {
            operator: '!=',
            value: null,
            animate: false
        }
    },

    listeners(){
        var {listen, error,path} = this.props;
        if (listen === false) {
            return;
        }
        if (listen || error == null) {
            this._handleProps({}, this.props);
            return {
                [listen == null || listen === true ? path : this.createKey(listen)]: this.handleValue
            }
        }
    },
    errorListeners(){
        var {error, path} = this.props;
        if (error) {
            this._handleProps({}, this.props);
            return {
                [error === true ? path : error]: this.handleValue
            }
        }
    },
    _handleProps(oldProps, props){

        if (oldProps.template != props.template) {
            if (props.template !== false) {
                if (typeof props.template === 'string') {
                    this.Template = props.loader.loadTemplate(props.template);
                } else {
                    this.Template = props.template;
                }
            }
        }
        if (oldProps.falseTemplate != props.falseTemplate) {
            if (typeof props.falseTemplate === 'string') {
                this.FalseTemplate = props.loader.loadTemplate(props.falseTemplate);
            }
        }
        if (oldProps.operator != props.operator) {
            this.evaluate = this.compile(props.operator);
            this.handleValue(this.state && this.state.value);
        }
    },
    handleValue(value){
        var matched = this.evaluate(value);
        this.setState({matched});
    },
    compile(operator){
        if (operator instanceof RegExp) {
            return (compare)=>operator.test(compare);
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
                        return (compare)=> operator.test(compare);
                    } else {
                        return (compare) => !operator.test(compare);
                    }
                }
                return opFactory(operator);
            } else {
                return this.props.loader.loadOperator(operator);
            }
        }


    },
    renderTemplate(){
        var Template = this.Template;
        return Template ? <Template key='true-conditional' loader={this.props.loader}
                                    valueManager={this.props.valueManager}>{this.props.children}</Template> : this.props.children;
    },
    renderFalseTemplate()
    {
        var FalseTemplate = this.FalseTemplate;
        return FalseTemplate ? <FalseTemplate loader={this.props.loader}
                                              key='false-conditional'
                                              valueManager={this.props.valueManager}>{this.props.children}</FalseTemplate> : null;
    },
    renderContent(){
        return this.state.matched ? this.renderTemplate() : this.renderFalseTemplate();

    },
    render()
    {
        if (this.props.animate === false) {
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
});
module.exports = Conditional;