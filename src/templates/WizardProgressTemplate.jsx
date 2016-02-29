'use strict'
import React, {Component} from 'react';
import PropTypes from '../PropTypes';

export default class WizardProgressTemplate extends Component {
    static propTypes = {
        style: PropTypes.style
    };
    static defaultProps = {
        index: 0,
        fieldsets: [],
        onClick(e){
        }
    };

    getStyle(i) {
        const {fieldsets:{length}, index, doneClass, doingClass, todoClass} = this.props;
        if (i < index || index == length) {
            return doneClass;
        }

        if (i === index) {
            return doingClass;
        }

        return todoClass;
    }

    render() {
        return <ol className={this.props.namespaceClass}>{
            this.props.fieldsets.map((s, i) =>
                <li value={i} key={'li'+i}
                    className={this.getStyle(i)}
                    onClick={this.props.onClick}>
                    <em>{i + 1}</em>
                    <span>{s.legend}</span>
                </li>
            )}
        </ol>;
    }
}
