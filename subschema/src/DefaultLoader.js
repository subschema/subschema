import loaderFactory from 'subschema-loader';

import bootstrap from 'subschema-css-bootstrap';
import processors from 'subschema-processors';
import validators from 'subschema-validators';

import form from 'subschema-component-form';
import autocomplete from 'subschema-component-autocomplete';
import list from 'subschema-component-list';
import wizard from 'subschema-component-wizard';
import modal from 'subschema-component-modal';

const loader = loaderFactory();
loader.addLoader(form);
loader.addLoader(autocomplete);
loader.addLoader(list);
loader.addLoader(wizard);
loader.addLoader(modal);
loader.addLoader(bootstrap);
loader.addLoader(processors);
loader.addLoader(validators);

export default loader;
