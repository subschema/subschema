import React, {Component} from 'react';
import Subschema, {PropTypes,Editor} from 'Subschema';

export default class Navigate extends Component {
    static contextTypes = {
        valueManager: PropTypes.valueManager
    }
    static propTypes = {
        pathname: PropTypes.listener,
        href: PropTypes.string,
        label: PropTypes.string,
    }
    static defaultProps = {
        pathname: "pathname",
        href: '/{.}',
        label: '{.}'
    }
    clzName = (name)=> {
        return 'list-group-item ' + ('/' + name.replace(/^#+?\//, '') === this.props.pathname ? 'active' : '');
    }

    constructor(props, ...rest) {
        super(props, ...rest);
        this._setupFormatters(props);
    }

    componentWillReceiveProps(props) {
        if (!(props.href === this.props.href && props.label === this.props.label)) {
            this._setupFormatters(props);
        }
    }

    _setupFormatters(props) {
        this.hrefFormatter = Editor.expressionEngine(props.href);
        this.labelFormatter = Editor.expressionEngine(props.label);
    }


    renderLink(value, i) {
        var {...props} = this.props;
        props['.'] = value;
        var href = this.hrefFormatter.format(props), label = this.labelFormatter.format(props);
        return <a href={href} className={this.clzName(href)} key={'link-'+i}>{label}</a>
    }

    renderItems(value) {
        value = value || {};
        return value.map(this.renderLink, this);
    }

    render() {
        return <div className="list-group left-nav">
            {this.renderItems(Object.keys(this.props.value))}
        </div>
    }
}
