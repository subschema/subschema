import DownloadButton from './components/DownloadButton';
import ExportButtons from './components/ExportButtons';
import JSONArea from './components/JSONArea';
import _generate from './generate';
import {source as _source, compile as _compile, normalize as _normalize} from './compile';
import  _validators from './validators';
export const types = {
    DownloadButton,
    ExportButtons,
    JSONArea
};

export const generate = _generate;
export const source = _source;
export const compile = _compile;
export const normalize = _normalize;
export const validators = _validators;

export default ({types, validators});