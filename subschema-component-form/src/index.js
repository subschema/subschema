import ButtonTemplate from './templates/ButtonTemplate';
import ButtonsTemplate from './templates/ButtonsTemplate';
import CheckboxTemplate from './templates/CheckboxTemplate';
import CheckboxesGroupTemplate from './templates/CheckboxesGroupTemplate';
import CheckboxesTemplate from './templates/CheckboxesTemplate';
import CollectionCreateTemplate from './templates/CollectionCreateTemplate';
import ContentItemTemplate from './templates/ContentItemTemplate';
import EditorTemplate from './templates/EditorTemplate';
import FieldSetTemplate from './templates/FieldSetTemplate';
import FormTemplate from './templates/FormTemplate';
import RadioItemTemplate from './templates/RadioItemTemplate';
import ObjectTemplate from './templates/ObjectTemplate';

import Checkbox from './types/Checkbox';
import Checkboxes from './types/Checkboxes';
import Date from './types/Date';
import Hidden from './types/Hidden';
import Number from './types/Number';
import Password from './types/Password';
import Radio from './types/Radio';
import Restricted from './types/Restricted';
import Select from './types/Select';
import Text from './types/Text';
import TextArea from './types/TextArea';
import Content from 'subschema-core/lib/Content';
import ObjectType from 'subschema-core/lib/Object';
import _RestrictedMixin from './types/RestrictedMixin';
import _Dom from './Dom';
import _css from './css';

export const RestrictedMixin = _RestrictedMixin;

export const Dom = _Dom;

export const css = _css;

export const templates = {
    ButtonTemplate,
    ButtonsTemplate,
    CheckboxTemplate,
    CheckboxesGroupTemplate,
    CheckboxesTemplate,
    CollectionCreateTemplate,
    ContentItemTemplate,
    EditorTemplate,
    FieldSetTemplate,
    FormTemplate,
    ObjectTemplate,
    RadioItemTemplate,
};
export const types = {
    Content,
    Checkbox,
    Checkboxes,
    Date,
    Hidden,
    Number,
    Object: ObjectType,
    Password,
    Radio,
    Restricted,
    Select,
    Text,
    TextArea,
};