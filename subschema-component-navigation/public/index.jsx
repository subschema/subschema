import React, {Component} from 'react';
import { loader, injector} from 'subschema';
import {render} from 'react-dom';
import PropTypes from 'subschema-prop-types';
import {NavigationForm, resolvers, PropTypes as HistoryTypes} from 'subschema-component-navigation';
import createHistory from 'history/createHashHistory';


const history = createHistory({
    hashType: 'slash' // Google's legacy AJAX URL format

});
class Index extends Component {
    render() {
        return <h2>Index Page</h2>
    }
}
class Doc extends Component {

    static propTypes = {
        page: PropTypes.string
    };

    render() {
        return <div>Doc {this.props.page}</div>

    }
}
class Example extends Component {

    static propTypes = {
        name: PropTypes.string,
        query: HistoryTypes.query
    };

    render() {
        const data = this.props.query.hasOwnProperty("useData");
        const error = this.props.query.hasOwnProperty("useErrors");
        return <div>Hello from {this.props.name}
            <div>use data: {data + ''}</div>
            <div>use errors: {error + ''}</div>
        </div>
    }
}
const H3 = (props) => {
    return <h3>{props.legend || props.children}</h3>
};
loader.addType({Example, Index, Doc});
loader.addTemplate({H3});

const schema = {
    "schema": {
        "useData": {
            "type": "ToggleLink",
            "label": "Data",
            "name": "useData",
            "className": "no-class",
            "template": false
        },
        "useErrors": {
            "type": "ToggleLink",
            "label": "Errors",
            "className": "no-class",
            "name": "useErrors",
            "template": false
        },
        "samples": {
            "type": "Navigate",
            "template": false,
            "href": "#/{.}"
        },
        "docs": {
            "type": "Navigate",
            "template": false,
            "href": "#/doc/{.}"
        },
        "main": {
            "type": "Routes",
            "routes": {
                "/doc/:page": "Doc",
                "/:name": "Example",
                "": "Index",
            }
        }
    },
    "fieldsets": [
        {
            "className": "container-fluid",
            "fieldsets": [
                {
                    "template": "NavTemplate",
                    "fields": [
                        "useData",
                        "useErrors"
                    ]
                },
                {
                    "template": "ModalTemplate",
                    "fields": "submit",
                    "content": "Values to be Submitted",
                    "legend": "Submit Called",
                    "buttons": [],
                    "conditional": {
                        "listen": "submit",
                        "dismiss": "submit",
                        "value": null,
                        "operator": "truthy"
                    }
                },
                {
                    "className": "row",
                    "fieldsets": [
                        {
                            "className": "col-md-2 col-sm-3 col-xs-12",
                            "fieldsets": [
                                {
                                    "legend": "Examples",
                                    "template": "H3"
                                },
                                {
                                    "fields": "samples"
                                },
                                {
                                    "legend": "Develop",
                                    "template": "H3"
                                },
                                {
                                    "fields": "docs"
                                }
                            ]
                        },
                        {
                            "className": "col-md-10 col-sm-9 col-xs-12",
                            "fields": [
                                "main"
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};


render(<NavigationForm schema={schema}
                       value={{samples: ["One", "Two", "Three"], docs: ["Doc1", "Doc2"]}}
                       loader={loader}
                       history={history}/>, document.getElementById('content'));
