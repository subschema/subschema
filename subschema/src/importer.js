import {warning} from 'subschema-utils';

const MAP = {
    "react-dom": require("react-dom"),
    "subschema-core": require("subschema-core"),
    "subschema-injection": require("subschema-injection"),
    "subschema-expression": require("subschema-expression"),
    "subschema-loader": require("subschema-loader"),
    "subschema-prop-types": require("subschema-prop-types"),
    "subschema-processors": require("subschema-processors"),
    "subschema-transitions": require("subschema-transitions"),
    "subschema-utils": require("subschema-utils"),
    "subschema-valuemanager": require("subschema-valuemanager"),
    "subschema-validators": require("subschema-validators"),
    "subschema-component-form": require("subschema-component-form"),
    "subschema-component-list": require("subschema-component-list"),
    "subschema-css-bootstrap": require("subschema-css-bootstrap"),
    "subschema-component-modal": require("subschema-component-modal"),
    "subschema-component-autocomplete": require("subschema-component-autocomplete"),
    "subschema-component-wizard": require("subschema-component-wizard")
};
function descend(obj, paths) {
    const copy = paths.concat();
    while (obj && copy.length) {
        obj = obj[copy.shift()];
    }
    return obj;
}

export default function subschemaImport(Subschema, React) {
    const overrides = {
        subschema: {default: Subschema},
        react: {default: React},
        'subschema-valuemanager': {
            default(){
                return Subschema.Form.defaultProps.valueManager;
            }
        },
        'subschema-loader': {
            default(){
                return Subschema.loader;
            }
        }
    };
    return function fakeRequire(dep) {
        const parts = dep.split('/');
        const pkgName = parts.shift();
        const pkg = overrides[pkgName] || MAP[pkgName];
        if (pkg) {
            if (parts.length == 0) {
                if (pkg.default != null)
                    return pkg.default;
                return pkg;
            }
            if (parts[0] == 'lib') {
                parts.shift();
                let ret = descend(pkg.default, parts) || descend(pkg, parts);
                if (ret != null) return ret;
            }

        }
        warning(false, 'woops can\'t locate dep %s', dep);
    };
}