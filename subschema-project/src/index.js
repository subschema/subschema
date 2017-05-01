import {source as _source, compile as _compile, normalize as _normalize} from './compile';
import _generate from './generate';
import _project from './templates/project';
import _page from './templates/page';
import _form from './form';
import _babelrc from 'subschema-dev-support/babelrc.json';
import _projectTemplates from './templates/project';

export const projectTemplates = _projectTemplates;
export const babelrc = _babelrc;
export const page = _page;
export const project = _project;
export const form = _form;
export const generate = _generate;
export const source = _source;
export const compile = _compile;
export const normalize = _normalize;

export const templates = {page, project};

