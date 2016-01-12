import React, {Component, Children} from 'react';
import Subschema, {PropTypes} from 'Subschema';

export default class ULTemplate extends Component {
    static propTypes = {
        liClassName: PropTypes.cssClass
    };
    static defaultProps = {
        liClassName: 'list-group-item'
    };

    render() {
        var props = this.props;
        return <ul className={props.className}>
            {Children.map(props.children, (child)=><li className={props.liClassName}>{child}</li>)}
        </ul>
    }
}