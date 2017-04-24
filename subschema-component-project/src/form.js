import form from './form.tmpl';


export default function formTag({sample, useData, useErrors}) {
    var {schema, setup, setupTxt = '', props = {}, data, errors} = sample;

    var propStr = ['schema={schema}'];
    if (useData){
        propStr.push('value={value}')
    }
    if (useErrors){
        propsStr.push('errors={errors}');
    }

    Object.keys(props).forEach(function (v) {
        propStr.push(`${v}={${v}}`);
    });

    return form({propStr: propStr.join('')});
}