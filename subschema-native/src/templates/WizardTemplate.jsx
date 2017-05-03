import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import WizardMixin from 'subschema-component-wizard/lib/WizardMixin';
import WizardTemplate from 'subschema-component-wizard/lib/WizardTemplate';
import PropTypes from 'subschema-prop-types';

var deviceWidth = Dimensions.get('window').width;

function donner(done) {
    done();
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    tabView: {
        overflow: 'hidden',
        width: deviceWidth,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        marginTop: -10,
        padding: 15,
    },
});
const {transitionForward, wizardProgressTemplate, transitionBackward, style, ...propTypes} =  WizardTemplate.propTypes;
export default class WizardTemplateNative extends WizardMixin {
    static propTypes = {...propTypes, ObjectType:PropTypes.type};
    static defaultProps = {
        ...WizardTemplate.defaultProps,
        ObjectType:'Object'
    };

    setNavState = (next)=> {
        const {fieldsets} = this.props.schema;
        var len = fieldsets.length, compState = this.state.compState;
        next = Math.max(Math.min(len - 1, next), 0);

        if (this.props.onNavChange(next, compState, fieldsets[next]) !== false) {
            this.refs.scroll.goToPage(next);
            this.setState({
                compState: next,
                disabled: false,
                prevState: next === compState ? this.state.prevState : compState
            });
        }
    };
    _handleSubmit = (e)=> {
        console.log('submit', e);
    };

    renderFieldset(current, compState) {
        let {className, ObjectType, Template, template, fieldsets, fields, onButtonClick, transitionLeaveTimeout, transitionEnterTimeout, carouselHeightClass, children, schema, ...rest} = this.props;
        ({schema} = this.props.schema);
        const buttons = current.buttons ? current.buttons : this.createButtons(compState);
        const currentSchema = {schema, fieldsets: [{buttons, ...current, legend: false}], template: Template};
        return (<View style={styles.tabView} tabLabel={current.legend} key={"wiz-view-"+compState}>
            <ObjectType
                onSubmit={this._handleSubmit}
                schema={currentSchema}
                onButtonClick={this::this.handleBtn}/>
        </View>);
    };

    render() {
        let {fieldsets} = this.props.schema;
        return (<ScrollableTabView ref="scroll" locked={true}>
                {fieldsets.map(this.renderFieldset, this)}
            </ScrollableTabView>
        );
    }
}
