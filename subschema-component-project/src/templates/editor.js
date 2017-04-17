"use strict";

import indexTmpl from './page/index.html.tmpl';
import {source, compile} from '../compile';

export default function (writeFile, data) {

    var scripts = data.scripts || (data.scripts = {});
    var form = source(data.sample, data.useData, data.useError, null);
    var src = scripts.source = `
(function(){
"use strict";
//import React, {Component} from "react";
//import Subschema,{Form, loader, valueManager, loaderFactory} from "Subschema";
//import {render} from "react-dom";


${form.vars}


${data.setupTxt}

return <Form ${form.propStr}/>;
})();
`;
    writeFile(null, compile(src).code);
}