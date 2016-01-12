"use strict";
import React, {Component} from 'react';
import Subschema, {PropTypes, loaderFactory, Editor, DefaultLoader} from 'Subschema';
import map from 'lodash/collection/map';
var loader = loaderFactory([DefaultLoader]);
var {propTypesToNames} = PropTypes;
var allPropTypes = {
    name: 'All Types',
    type: {
        propTypes: Editor.fieldPropTypes
    }
}
export default class DevelopTypes extends Component {
    static contextTypes = {
        loader: PropTypes.loader
    };

    renderPropType(type, i) {

        return <li key={`type-${i}`} className="list-group-item">
            <h4 className="list-group-item-heading">{i}</h4>
            <p className="list-group-item-text">{type}</p>
        </li>
    }

    renderPropTypes(type) {
        return <ul className="list-group">
            {map(propTypesToNames(type.propTypes), this.renderPropType, this)}
        </ul>
    }

    renderTypeDoc(type, key) {
        return <div className="" key={`type-doc-${key}`}>
            <h4>{type.name}</h4>
            <div>
                <h5>Options</h5>
                {this.renderPropTypes(type.type, this)}
            </div>
        </div>
    }

    render() {

        return <div>
            <h3>Type Documentation</h3>

            {this.renderTypeDoc(allPropTypes, 'All')}
            {loader.listTypes().map(this.renderTypeDoc, this)}
        </div>
    }
}