import React, { Component } from 'react';
import Content from 'subschema-core/lib/Content';
import PropTypes from 'subschema-prop-types';

export default class CollectionCreateTemplate extends Component {
    static propTypes    = {
        title        : PropTypes.node,
        style        : PropTypes.style,
        inline       : PropTypes.bool,
        create       : PropTypes.bool,
        editText     : PropTypes.string,
        createText   : PropTypes.string,
        onChange     : PropTypes.valueEvent,
        value        : PropTypes.value,
        origValue    : PropTypes.any,
        pid          : PropTypes.any,
        errors       : PropTypes.errors,
        onButtonClick: PropTypes.func
    };
    static defaultProps = {
        create    : true,
        editText  : 'Edit ',
        createText: 'Create ',
    };

    renderInline() {
        return <div
            className={this.props.inlineClass}>{this.props.children}</div>
    }

    renderPanel() {
        let { title, panelClass, editText, createText, panelTitleClass, panelHeadingClass, panelBodyClass, groupClass, create } = this.props;
        if (title === false) {
            title = '';
        } else if (title == null) {
            title = create ? createText : editText;
        } else if (typeof title === 'string') {
            title = {
                type     : 'h3',
                content  : (create ? `${createText} ${title}`
                    : `${editText} ${title}`),
                className: panelTitleClass
            }
        }
        return (<div className={panelClass}>
            <Content content={title} type='div' className={panelHeadingClass}/>
            <div className={this.props.panelBodyClass}>
                <div className={this.props.groupClass}>
                    {this.props.children}
                </div>
            </div>
        </div>);
    }

    render() {
        return this.props.inline ? this.renderInline() : this.renderPanel();
    }
};

