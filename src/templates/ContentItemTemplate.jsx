import React, {Component} from 'react';
import style  from 'subschema-styles/Mixed-style';
import PropTypes from '../PropTypes';
import _get from 'lodash/object/get';


export default class ContentItemTemplate extends Component {

    static propTypes = {
        onClick: PropTypes.func,
        pid: PropTypes.any,
        pos: PropTypes.number,
        showKey: PropTypes.bool,
        labelKey: PropTypes.string,
        value(props, propName, componentName) {
            var value = props[propName];
            var labelKey = props.labelKey;
            if ('value' in props) {
                if (labelKey) {
                    return PropTypes.node(props.value, labelKey, componentName)
                } else
                    return PropTypes.node(value, 'value', componentName);
            }
            if (props.showKey) {
                return PropTypes.node(props, 'key', componentName);
            }
        }
    };
    //(pos, val, pid)
    handleClick = (e)=> {
        e && e.preventDefault();
        this.props.onClick(this.props.pos, this.props.value.value, this.props.pid);
    };

    render() {
        var {value,showKey, children, labelKey} = this.props;
        var key = value.key || '';
        var label = labelKey ? _get(value.value, labelKey, '') : value.value;
        return (<span onClick={this.handleClick} className={this.props.onClick ? 'clickable' : ''}>
            {showKey ? <h4 className={style.item}>{key}</h4> : null}
            <span className={style.itemInner}>{label }</span>
            {children}
        </span>);
    }
}
