import expect from "expect";
import templates from "../src/templates/project/index";
import pkg from "../../subschema/package.json";

describe('tmpl-loader', function () {

    it('should escape things', function () {
        expect(templates['Readme.md']).toExist();
        var resp = templates['Readme.md']({
            schema: {},
            title: 'Hello',
            demo: 'what',
            jsName: 'uhhu',
            project: {
                name: 'hello'
            }, pkg,
            sample: {}
        });
        //  expect(resp).toBe("Hello\n===\n\n\n##Demo\nSee it in action [here]()\n\nOr run it \n\n```sh\n  git clone \n  cd subschema-image\n  npm install\n  npm run hot &\n  open http://localhost:8082\n```\n\n##Installation\n```sh\n $ npm install subschema-image\n``\n\n##Usage\n```jsx\n\n import React, {Component} from 'react';\n import Subschema, {loader, Form} from 'Subschema';\n import uhhu from 'hello';\n \n loader.addLoader(imageloader);\n \n //A simple Schema for this demo.\n var schema = {}\n \n export default class App extends Component {\n \n     render() {\n         return <div>\n             <h3></h3>\n             <Form schema={schema}/>\n         </div>\n     }\n }\n\n\n  \n```")
    });
    Object.keys(templates).forEach((key)=> {
        it(`should render template "${key}"`, function () {
            expect(templates[key]({
                schema: {},
                title: 'Hello',
                demo: 'what',
                jsName: 'uhhu',
                setupTxt: 'Setup Text',

                scripts: {
                    form: {
                        vars: ''
                    }
                },
                sample: {},

                project: {
                    name: 'hello'
                },
                pkg
            })).toExist();
        });
    })
})
;