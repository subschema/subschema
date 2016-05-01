"use strict";
import {React, click, change,findNode,  into,TestUtils,expect,byComponents, byTag, byTags, byComponent, select,  Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, templates, ValueManager, loaderFactory, DefaultLoader} from 'Subschema';
import ModalSample from 'subschema-test-support-samples/Modal.js';

const {ModalTemplate} = templates;


function byId(node, id) {
    var all = TestUtils.findAllInRenderedTree(node, function (inst) {
        var inode = findNode(inst);
        if (inode == null) {
            return false;
        }
        return inode.id === id;
    });
    return all[0];
}

describe('templates/ModalTemplate', function () {
    this.timeout(50000);
    it('should render', function () {
        //loader, schema, Subschema, React
        const valueManager = ValueManager();
        const form = into(<Form schema={ModalSample.schema} valueManager={valueManager}/>, true);
        expect(form).toExist();


        let modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toNotExist('modal should not show');
        valueManager.update('showAddressModal', true);
        modal = byComponent(form, ModalTemplate);
        expect(modal).toExist('Modal should show');

        let buttons = byTags(modal, 'button');
        expect(buttons.length).toBe(3, 'should have 3 buttons');
        click(buttons[0]);
        expect(valueManager.path('showAddressModal')).toBe(null, 'dismiss modal');

        valueManager.update('showAddressModal', true);
        modal = byComponent(form, ModalTemplate);
        let addr = byId(modal, 'address.street');
        change(addr, 'hello');
        buttons = byTags(modal, 'button');
        click(buttons[1]);
        modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toNotExist('hide');
        expect(valueManager.path('address')).toBe(null, 'should revert change on cancel');

        valueManager.update('showAddressModal', true);
        modal = byComponent(form, ModalTemplate);
        addr = byId(modal, 'address.street');
        change(addr, 'hello2');
        buttons = byTags(modal, 'button');
        click(buttons[2]);
        modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toNotExist('hide');
        expect(valueManager.path('address.street')).toBe('hello2', 'should commit change on save');


        valueManager.update('showAddressModal', true);
        modal = byComponent(form, ModalTemplate);
        addr = byId(modal, 'address.street');
        change(addr, 'hello3');
        buttons = byTags(modal, 'button');
        click(buttons[1]);
        modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toNotExist('hide');
        expect(valueManager.path('address.street')).toBe('hello2', 'should revert change on cancel');

    });
    it('should render template with buttons', function () {
        //loader, schema, Subschema, React
        const valueManager = ValueManager();
        const form = into(<Form schema={{
            schema:{
                test:'Text'
            },
            fieldsets:[
            {
                template:"ModalTemplate",
                path:'toggle',
                legend:'hello',
                fields:['test'],
                buttons:['close', 'cancel', 'submit']
            }
            ]
        }} valueManager={valueManager}/>, true);
        expect(form).toExist();


    });
});