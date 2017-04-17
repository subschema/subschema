import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import _get from 'lodash/get';


export default class ContentItemTemplate extends Component {

    static propTypes = {
        onClick: PropTypes.func,
        pid: PropTypes.any,
        pos: PropTypes.number,
        showKey: PropTypes.bool,
        labelKey: PropTypes.string,
        itemInnerClass: PropTypes.string,
        clickableClass: PropTypes.string,
        value(props, propName, componentName, ...rest) {
            var value = props[propName];
            var labelKey = props.labelKey;
            if ('value' in props) {
                if (labelKey) {
                    return PropTypes.node(props.value, labelKey, componentName, ...rest)
                } else
                    return PropTypes.node(value, 'value', componentName, ...rest);
            }
            if (props.showKey) {
                return PropTypes.node(props, 'key', componentName, ...rest);
            }
        }
    };
    static defaultProps = {
        clickableClass: 'clickable'
    };
    //(pos, val, pid)
    handleClick = (e)=> {
        e && e.preventDefault();
        this.props.onClick(this.props.pos, this.props.value.value, this.props.pid);
    };

    render() {
        const {value,showKey, children,itemInnerClass, itemClass, clickableClass, labelKey} = this.props;
        const key = value.key || '';
        const _label = labelKey ? _get(value.value, labelKey, '') : value.value;
        return (<span onClick={this.handleClick} className={this.props.onClick ? clickableClass : ''}>
            {showKey ? <h4 className={itemClass}>{key}</h4> : null}
            <span className={itemInnerClass}>{_label}</span>
            {children}
        </span>);
    }
}
