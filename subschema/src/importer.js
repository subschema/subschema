import {warning} from 'subschema-utils';

/**
 * A list of packages that are exported for subschema.  Use this to
 * test and run pure browser based subschema.
 *
 * @type {{react-dom: (*), subschema-core: *, subschema-injection: *, subschema-expression: *, subschema-loader: *, subschema-prop-types: *, subschema-processors: *, subschema-transitions: *, subschema-utils: *, subschema-valuemanager: *, subschema-validators: *, subschema-component-form: *, subschema-component-list: *, subschema-css-bootstrap: *, subschema-component-modal: *, subschema-component-autocomplete: *, subschema-component-wizard: *}}
 */
export const EXPORTS = {
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
        subschema: Subschema,
        react: React,
        ['subschema-valuemanager'](){
            return Subschema.Form.defaultProps.valueManager;
        },
        ['subschema-loader'](){
            return Subschema.loader;
        }
    };
    const requireMap = {...EXPORTS, ...overrides};

    return function importer(dep) {
        const parts = dep.split('/');
        const pkgName = parts.shift();
        const pkg = requireMap[pkgName];
        if (pkg) {
            if (parts.length == 0) {
                if (pkg.default != null)
                    return pkg.default;
                return pkg;
            }
            if (parts[0] == 'lib') {
                const libPkg = requireMap[`${pkgName}/lib`] || pkg;
                parts.shift();
                let ret = (libPkg.default && descend(libPkg.default, parts)) || descend(libPkg, parts);
                if (ret != null) return ret;
            }

        }
        warning(false, 'woops can\'t locate dep %s', dep);
    };
}