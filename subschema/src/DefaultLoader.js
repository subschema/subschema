import {templates as formTemplates, types as formTypes, styles as formStyles} from 'subschema-component-form';
import {templates as autoTemplates, types as autoTypes, styles as autoStyles} from 'subschema-component-autocomplete';
import {templates as wizardTemplates, styles as wizardStyles} from 'subschema-component-wizard';
import {templates as modalTemplates, styles as modalStyles} from 'subschema-component-modal';
import {styles as bootstrapStyles, transitions} from 'subschema-css-bootstrap';
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

loader.addStyle(autoStyles);
loader.addStyle(bootstrapStyles);
loader.addStyle(formStyles);
loader.addStyle(wizardStyles);

loader.addTransition(transitions);
loader.addProcessor(processors);
loader.addValidator(validators);

export default loader;
