import '../node_modules/bootstrap/dist/css/bootstrap.css';
import _Autocomplete from './Autocomplete.less';
import _ListItemTemplate from './ListItemTemplate.less';
import _WizardProgressTemplate from './WizardProgressTemplate.less';
import _WizardTemplate from './WizardTemplate.less';


export const Autocomplete = _Autocomplete;
export const ListItemTemplate = _ListItemTemplate;
export const WizardProgressTemplate = _WizardProgressTemplate;
export const WizardTemplate = _WizardTemplate;

export default ({
    Autocomplete,
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
    WizardProgressTemplate,
    WizardTemplate
});