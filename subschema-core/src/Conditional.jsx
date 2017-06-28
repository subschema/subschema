import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import renderTemplate from './RenderTemplate';
import { settings } from './resolvers/transition';

export default class Conditional extends Component {
    static contextTypes = PropTypes.contextTypes;
    static displayName  = "Conditional";
    static Transition   = settings.Transition;
    static defaultProps = {
        operator: "!=",
        animate : false,
        error   : null,
        listen  : '.',
        value   : null,
    };

    static propTypes = {
        /**
         * Current path of the component
         */
        path  : PropTypes.path,
        /**
         * The value  to use too compare against  if not given, than
         * it will be a compare against null.
         */
        value : PropTypes.any,
        /**
         * The path to listen to can be empty,
         * in which case will look for
         * defaults to the current path.
         */
        listen: PropTypes.listener,

        /**
         * The template to use if it evaluates to true
         * IE - Modal, ShowHide
         */
        template     : PropTypes.template,
        /**
         * The template to use if it evaluates to false
         * defaults to a null span
         */
        falseTemplate: PropTypes.template,
        /**
         * A string to use  a named transition,or a boolean.
         *
         * if a string that string will be the "name" to use to animate.
         * If an object is passed than it will passed as props to the
         * transition group. If === true than the default animation will be
         * used. If === false than no animation is used
         *
         */
        transition   : PropTypes.transition,
        /**
         * How to compare the value to the matched value.
         * If ommitted and a value is given than === is used.
         * If ommitted and the value is omitted than a !(value == null) is used.
         *
         */
        operator     : PropTypes.operator,
        /**
         * Listen to an error rather than the mutually exclusive with listen.
         */
        error        : PropTypes.error,
        /**
         * Path to update to make conditional false.
         */
        dismiss      : PropTypes.path,

        buttons: PropTypes.buttons,
        field  : PropTypes.any
    };

    renderTemplate() {
        let { value, listen, error, template, falseTemplate, dismiss, operator, transition, children, ...props } = this.props;
        if (dismiss) {
            children = React.cloneElement(children, { dismiss });
        }
        return renderTemplate({
            key: 'true-conditional',
            template,
            ...props,
            children
        })

    }

    renderFalseTemplate() {

        let { value, listen, error, template, falseTemplate, dismiss, operator, transition, children, ...props } = this.props;

        return falseTemplate ? renderTemplate({
            key     : 'false-conditional',
            template: falseTemplate,
            ...props,
            children
        }) : <span key='false-conditional'/>;
    }

    renderContent() {

        const isMatch = this.props.operator(this.props.listen,
            this.props.value);
        // console.log('isMatch', this.props.listen, this.props.value);
        return isMatch ? this.renderTemplate() : this.renderFalseTemplate();

    }


    render() {
        const { TransitionGroup } = this.constructor;

        if (!this.props.transition || !TransitionGroup) {
            return this.renderContent();
        }

        return <TransitionGroup {...this.props.transition}>
            {this.renderContent()}
        </TransitionGroup>
    }
}
