import {templates as formTemplates, types as formTypes} from 'subschema-component-form';
import {templates as autoTemplates, types as autoTypes} from 'subschema-component-autocomplete';
import {templates as wizardTemplates} from 'subschema-component-wizard';
import {templates as modalTemplates} from 'subschema-component-modal';
import {styles, transitions} from 'subschema-css-bootstrap';
import {processors} from 'subschema-processors';
import loaderFactory from 'subschema-loader';
import {validators} from 'subschema-validators';

const loader = loaderFactory();

loader.addTemplate(formTemplates);
loader.addTemplate(autoTemplates);
loader.addTemplate(wizardTemplates);
loader.addTemplate(modalTemplates);

loader.addType(formTypes);
loader.addType(autoTypes);

loader.addStyle(styles);
loader.addTransition(transitions);

loader.addProcessor(processors);
loader.addValidator(validators);

export default loader;
