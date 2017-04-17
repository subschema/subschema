import React from 'react';

export default function ObjectTemplate(props) {
    var {children, className, fieldAttrs, ...rest} = props;
    return (<div className={className} {...fieldAttrs}>
        {children}
    </div>);
}
