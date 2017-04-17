"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'Subschema';

import UninjectedNewProject from '../src/components/NewProject.jsx';

const seperator = ' | ';
export default class Index extends Component {
    static defaultProps = {
        NewProject: UninjectedNewProject
    };
    static propTypes = {
        NewProject: PropTypes.injectClass
    };

    render() {
        const {NewProject} = this.props;
        return (
            <div className="jumbotron clearfix">
                <h1>Subschema</h1>

                <p>This is app shows how to use Subschema</p>

                <p>Wherever it shows <b>Show Example Code</b> you can click to see the code that geneated the form, and
                    you can edit
                    the code in place,seeing the result immediately.</p>

                <p>You can see how it works by loading <b>Errors</b> and <b>Data</b>, from the buttons up in the menu
                    bar, or editing the code inline</p>

                <p>Here are some ideas of things you can do with Subschema.</p>
                <dl>
                    <dt>3rd party component integration</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-external-component-example">demo</a>{seperator}<a
                        href="https://github.com/subschema/subschema-external-component-example">repo</a>
                    </dd>
                    <dt>Todo built on Subschema with react-motion</dt>
                    <dd>
                        <a href="http://jspears.github.io/subschema-motion/">demo</a>{seperator}<a
                        href="https://github.com/jspears/subschema-motion">repo</a>
                    </dd>
                    <dt>Github OAuth Integration</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-github/">demo</a>{seperator}<a
                        href="https://github.com/subschema/subschema-github/">repo</a>
                    </dd>
                    <dt>Image Upload</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-image">demo</a>{seperator}<a
                        href="https://github.com/subschema/subschema-image">repo</a>
                    </dd>
                    <dt>Google Places Autocomplete</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-g-suggest">demo</a>{seperator}<a
                        href="https://github.com/subschema/subschema-g-suggest">repo</a>
                    </dd>
                    <dt>Project Generator</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-project/">demo</a>{seperator}<a
                        href="https://github.com/subschema/subschema-g-suggest">repo</a>
                    </dd>

                </dl>

                <p><a className="btn btn-primary btn-lg" href="https://github.com/subschema/subschema/wiki" role="button">Learn
                    more</a></p>
                <hr/>
                <p>Or you can create a brand new project</p>
                <NewProject/>

            </div>
        );
    };

}