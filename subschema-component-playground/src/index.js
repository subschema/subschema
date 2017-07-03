import _DisplayValueAndErrors from './DisplayValueAndErrors';
import _Editor from './Editor';
import _SubschemaPlayground from './SubschemaPlayground';
import _DownloadButton from './DownloadButton';
import _ExportButtons from './ExportButtons';
import _validators from './validators';
import _SchemaEditor from './SchemaEditor';

export const validators            = _validators;
export const DisplayValueAndErrors = _DisplayValueAndErrors;
export const Editor                = _Editor;
export const SubschemaPlayground   = _SubschemaPlayground;
export const DownloadButton        = _DownloadButton;
export const ExportButtons         = _ExportButtons;
export const SchemaEditor          = _SchemaEditor;
export const types                 = {
    DisplayValueAndErrors,
    Editor,
    DownloadButton,
    ExportButtons,
    SubschemaPlayground,
    SchemaEditor
};

export default ({ types, validators });
