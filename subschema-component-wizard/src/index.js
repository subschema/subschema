import _WizardProgressTemplate from './WizardProgressTemplate';
import _WizardTemplate from './WizardTemplate';
import _WizardMixin from './WizardMixin';

export const WizardMixin = _WizardMixin;
export const WizardTemplate = _WizardTemplate;
export const WizardProgressTemplate = _WizardProgressTemplate;
export const templates = {
    WizardTemplate,
    WizardProgressTemplate
};
export default ({
    templates
})