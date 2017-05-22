import React, {Component} from 'react';
import WizardMixin from 'subschema-component-wizard/lib/WizardMixin';
import WizardTemplate from 'subschema-component-wizard/lib/WizardTemplate';
import PropTypes from 'subschema-prop-types';
import {TabViewAnimated, TabBar} from 'react-native-tab-view';
import {RenderTemplate} from 'subschema-core';

function donner(done) {
    done();
}

const {transitionForward, wizardProgressTemplate, transitionBackward, style, ...propTypes} = WizardTemplate.propTypes;
export default class WizardTemplateNative extends WizardMixin {
    static propTypes = {...propTypes, ObjectType: PropTypes.type};
    static defaultProps = {
        ...WizardTemplate.defaultProps,
        ObjectType: 'ObjectType',
        wizardProgressTemplate: TabBar
    };


    setNavState = (next) => {
        const {fieldsets} = this.props.schema;
        const len = fieldsets.length, compState = this.state.compState;
        next = Math.max(Math.min(len - 1, next), 0);

        if (this.props.onNavChange(next, compState, fieldsets[next]) !== false) {
            // this._scroll.goToPage(next);
            this.setState({
                compState: next,
                disabled: false,
                prevState: next === compState ? this.state.prevState : compState
            });
        }
    };


    renderFieldset(current, compState) {

        let {className, ObjectType, Template, template, fieldsets, fields, onButtonClick, transitionLeaveTimeout, transitionEnterTimeout, carouselHeightClass, children, schema, ...rest} = this.props;
        ({schema} = this.props.schema);
        const buttons = current.buttons ? current.buttons : this.createButtons(this.state.compState);

        const currentSchema = {schema, fieldsets: [{buttons, ...current, legend: false}], template: Template};
        return <ObjectType style={this.props.tabViewClass} tabLabel={current.legend} key={"wiz-view-" + compState}
                           onSubmit={this.props.onSubmit}
                           schema={currentSchema}
                           onButtonClick={this._handleBtn}/>;
    };

    _renderFieldset = (key) => {
        let {current} = this.state;
        if (!current) {
            const {fieldsets, schema} = this.props.schema;
            current = fieldsets[key.index];
        }
        return this.renderFieldset(current, key.index);
    };


    _renderHeader = props => {

        return <RenderTemplate key="progress-template-key" template={this.props.wizardProgressTemplate}
                               {...props}
                               index={this.state.done ? fieldsets.length : this.state.compState}
                               onClick={this.handleOnClick}/>;
    };
    _handleTabChange = (compState) => {
        this.setState({compState});
    };
    _handleBtn = (...args) => {
        return this.handleBtn(...args);
    };

    _navigateState() {
        if (this._currentState && this._currentState.index === this.state.compState) {
            return this._currentState;
        }
        return (this._currentState = {
            index: this.state.compState || 0,
            routes: this.props.schema.fieldsets.map((fs, key) => (
                {
                    title: fs.legend,
                    key: key + ''
                }))
        });

    }

    render() {
        return <TabViewAnimated locked={true}
                                onRequestChangeTab={this._handleTabChange}
                                lazy={true}
                                navigationState={this._navigateState()}
                                renderHeader={this._renderHeader}
                                renderScene={this._renderFieldset}/>
    }
}
