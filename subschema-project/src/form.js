

export default function formTag({sample, useData, useErrors}) {
    var {props = []} = sample;

    var propStr = ['schema={schema}'];
    if (useData){
        propStr.push('value={value}')
    }
    if (useErrors){
        propsStr.push('errors={errors}');
    }

    props.forEach(function (v) {
        if (Array.isArray(v)){
            propStr.push(`${v[0]}={${v[1]}}`);
        }else {
            propStr.push(`${v}={${v}}`);
        }
    });

    return `<Form ${propStr.join(' ')}/>`;
}