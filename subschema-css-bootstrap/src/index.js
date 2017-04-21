import 'bootstrap/dist/css/bootstrap.css';
import 'subschema-transitions/lib/style.css';
import {transitions as _transitions} from 'subschema-transitions';
import Autocomplete from './Autocomplete.less';
import AutocompleteItemTemplate from './AutocompleteItemTemplate-style';
import ListItemTemplate from './ListItemTemplate.less';
import WizardProgressTemplate from './WizardProgressTemplate.less';
import WizardTemplate from './WizardTemplate.less';
import ButtonsTemplate from './ButtonsTemplate-style';
import CheckboxTemplate from './CheckboxTemplate-style';
import CheckboxesGroupTemplate from './CheckboxesGroupTemplate-style';
import EditorTemplate from './EditorTemplate-style';
import FormTemplate from './FormTemplate-style';
import RadioItemTemplate from './RadioItemTemplate-style';

export const transitions = _transitions;

export const styles = ({
    Autocomplete,
    AutocompleteItemTemplate,
    ButtonsTemplate,
    CheckboxTemplate,
    CheckboxesGroupTemplate,
    EditorTemplate,
    FormTemplate,
    ListItemTemplate: Object.assign({
            moveUp: 'glyphicon glyphicon-chevron-up btn-up',
            moveDown: 'glyphicon glyphicon-chevron-down btn-down',
            delete: 'glyphicon glyphicon-remove btn-delete',
            itemValue: "item-value btn-edit",
            button: 'btn btn-xs btn-default',
            listGroupItem: 'list-group-item',
            hasError: 'has-error',
            help: "help-block",
            clickable: 'clickable',
            ctrlButtons: 'btn-group'
        },
        ListItemTemplate),
    RadioItemTemplate,
    WizardProgressTemplate,
    WizardTemplate
});

export default ({styles, transitions});