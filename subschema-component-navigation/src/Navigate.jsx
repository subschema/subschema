import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';

class NavigateItem extends Component {

    static propTypes = {
        onBlur   : PropTypes.blurValidate,
        value    : PropTypes.value,
        id       : PropTypes.id,
        className: PropTypes.typeClass,
        href     : PropTypes.expression,
        label    : PropTypes.expression,
        path     : PropTypes.path,
        onClick  : PropTypes.valueEvent,
    };

    static defaultProps = {
        pathname: ".",
        onClick : '@pathname'
    };

    clzName = (name = '') => {
        return 'list-group-item ' + ('/' + name.replace(/^#+?\//, '')
                                     === this.props.pathname ? 'active' : '');
    };

    render() {
        const { href, label, ...props } = this.props;
        return <a href={href} onClick={this.handleClick}
                  className={this.clzName(href)}>{label}</a>
    }

}
export default class Navigate extends Component {

    static propTypes = {
        path    : PropTypes.path,
        pathname: PropTypes.value,
        Item    : PropTypes.injectClass
    };

    static defaultProps = {
        pathname: "@pathname",
        Item    : NavigateItem,
        href    : '#/{.}',
        label   : '{.}'
    };


    renderItems() {
        const { Item, value, path, href, label, pathname } = this.props;

        return value.map(
            (v, i) => <Item key={`nav-item-${i}`} pathname={pathname}
                            href={href} label={label} path={`${path}.${i}`}/>);
    }

    render() {
        return <div className="list-group left-nav">
            {this.renderItems()}
        </div>
    }
}
