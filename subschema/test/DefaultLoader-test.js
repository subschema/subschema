import {DefaultLoader, templates, loader, loaderFactory} from 'Subschema';
import expect from 'expect';

describe('DefaultLoader', function () {
    Object.keys(templates).forEach((template)=> {
        if (template == 'default') return;

        it(`should load template ${template}`, ()=> {
            const ET = loader.loadTemplate(template);
            expect(ET).toBe(templates[template], `not the right template ${template}`);
            expect(typeof ET).toBe('function');
        });
    });
});