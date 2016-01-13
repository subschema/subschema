"use strict";

import React from 'react';
import Highlight from '../components/Highlight';
import samples from 'subschema-test-support';

export default function Loader() {
    return (<div>
        <h3>Loader</h3>
        <fieldset>
            <legend></legend>
            <p className="lead">
                Loaders are the key part to extending subschema. I am going to write something about it here.
                Until then here is some loader zen.
            </p>

            <div className="panel">
                <div className="panel-heading">
                    <h3>Writing a loader</h3>
                </div>
                <div className="panel-body">

                    <Highlight lang="javascript">
                        {samples.Loader.setupTxt}
                    </Highlight>
                </div>
            </div>

        </fieldset>
    </div>);

};

