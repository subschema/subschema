import React from 'react';
import 'subschema-css-bootstrap/lib/style.css';
import {
    byClass, byComponent, byComponents, byName, change, cleanUp, click, expect,
    filterProp, findNode, into, Simulate, TestUtils
} from 'subschema-test-support';

import form from 'subschema-component-form';
import list from 'subschema-component-list';
import css from 'subschema-css-bootstrap';

import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';


const { ListItemTemplate, CollectionCreateTemplate, } = list.templates;
const { ButtonTemplate, EditorTemplate }              = form.templates;

function controlBtn(task, action) {
    return filterProp(byComponents(task, ButtonTemplate), 'action', action)[0];
}
function newContext() {
    const ctx = newSubschemaContext();
    ctx.loader.addLoader(form);
    ctx.loader.addLoader(list);
    ctx.loader.addLoader(css);
    return ctx;
}
const debug = false;
describe('subschema-component-list-test', function () {

    this.timeout(50000);

    afterEach(cleanUp);

    function add(root, c) {
        const allBtns = TestUtils.scryRenderedComponentsWithType(root,
            ButtonTemplate);
        const addBtn  = allBtns[0];

        click(addBtn);
        const create = byComponent(root, CollectionCreateTemplate);
        const input  = findNode(byComponent(create, form.types.Text));
        change(input, `Hello, world ${c}`);
        const buttons = TestUtils.scryRenderedComponentsWithType(create,
            ButtonTemplate);
        expect(buttons[0]).toExist('buttons[0] does not exist');
        const btn = filterProp(buttons, 'action', 'submit')[1];
        click(btn);
        const value = root.getValue();
        expect(value.tasks, 'tasks should exist').toExist();
        expect(value.tasks[c], `tasks[${c}] should equal`)
            .toEqual(`Hello, world ${c}`);
        const tasks = byComponents(root, ListItemTemplate);
        return tasks[c];
    }

    function edit(root, c) {
        const tasks = byComponents(root, ListItemTemplate);
        const item  = byClass(tasks[c], 'clickable')[0];
        click(findNode(item));
        const createTemplate = byComponent(root, CollectionCreateTemplate);
        const input          = byName(createTemplate, `@edit@tasks.value`);
        change(input, `Hello, world ${c}`);
        const btns = filterProp(
            TestUtils.scryRenderedComponentsWithType(createTemplate,
                ButtonTemplate), 'action', 'submit');
        const btn  = btns[0];
        Simulate.submit(findNode(btn));
        const value = root.getValue();
        expect(input.value).toEqual('Hello, world ' + c);
        return tasks[c];
    }


    it('should render a list with data without canAdd', function () {
        const { Form, valueManager } = newContext();
        const schema                 = {
            schema: {
                tasks: {
                    type      : 'List',
                    title     : this.test.title,
                    itemType  : 'Text',
                    canEdit   : true,
                    canReorder: true,
                    canDelete : true
                }
            }
        };
        const data                   = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        };
        valueManager.setValue(data);
        const root   = into(<Form schema={schema} key='form3'
                                  valueManager={valueManager}/>,
            debug);
        const tasks  = byComponents(root,
            ListItemTemplate);
        const addBtn = byClass(root, 'btn-add')[0];

        expect(addBtn).toNotExist('add button does not exist');
        expect(tasks[0]).toExist('task 1');
        expect(tasks[1]).toExist('task 2');
        expect(tasks[2]).toExist('task 3');
        const span = byClass(tasks[0], 'clickable')[0];
        click(span);

        const edit = byComponent(root, CollectionCreateTemplate);
        expect(edit).toExist('should find CollectionCreateTemplate');
        const input = byName(edit, '@edit@tasks.value');
        expect(findNode(input).value).toBe('one', 'value should be one');

    });
    it('should render a list with data is not editable', function () {
        const { Form, valueManager } = newContext();

        const schema = {
            schema: {
                tasks: {
                    title   : this.test.title,
                    type    : 'List',
                    itemType: 'Text'
                }
            }
        }, data      = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        };
        let root     = into(<Form key='form0' schema={schema}
                                  value={data}/>, debug);
        const addBtn = byClass(root, 'btn-add')[0];

        expect(addBtn).toNotExist();
        const tasks = byComponents(root, ListItemTemplate);
        expect(tasks.length).toBe(3);
        tasks.forEach(function (task) {
            expect(controlBtn(task, 'up')).toNotExist();
            expect(controlBtn(task, 'down')).toNotExist();
            expect(controlBtn(task, 'delete')).toNotExist();
        })
        root = null;
    });
    /**
     * TODO - Figure out why this fails when it is not the only test run.
     *
     */
    it.skip('should render a list without data and add values', function () {
        const { Form, valueManager } = newContext();
        const schema                 = {
            schema: {
                tasks: {
                    type      : 'List',
                    title     : this.test.title,
                    itemType  : 'Text',
                    canAdd    : true,
                    canEdit   : true,
                    canReorder: true,
                    canDelete : true
                }
            }
        };

        let root    = into(<Form key='form1' schema={schema}
                                 valueManager={valueManager}/>,
            debug);
        const tasks = byComponents(root, ListItemTemplate);
        expect(root).toExist();
        expect(tasks.length).toEqual(0);


        const a0 = add(root, 0);
        expect(byClass(a0, 'btn-up')[0]).toNotExist();
        expect(byClass(a0, 'btn-delete')[0]).toExist();
        expect(byClass(a0, 'btn-down')[0]).toNotExist();

        /*
         var a1 = add(root, 1);
         expect(byClass(a1, 'btn-up')[0]).toExist();
         expect(byClass(a1, 'btn-delete')[0]).toExist();
         expect(byClass(a1, 'btn-down')[0]).toNotExist();

         var a2 = add(root, 2);
         expect(byClass(a2, 'btn-up')[0]).toExist();
         expect(byClass(a0, 'btn-delete')[0]).toExist();
         expect(byClass(a2, 'btn-down')[0]).toNotExist();
         expect(byClass(a1, 'btn-down')[0]).toExist();


         click(byClass(a0, 'btn-delete')[0]);
         expect(root.getValue().tasks.length).toEqual(2);

         click(byClass(a1, 'btn-delete')[0]);
         expect(root.getValue().tasks.length).toEqual(1);

         click(byClass(a2, 'btn-delete')[0]);
         expect(root.getValue().tasks.length).toEqual(0);*/

        root = null;
    });
    it('should edit a value', function () {
        const { Form, valueManager } = newContext();

        const schema = {
            schema: {
                tasks: {
                    type      : 'List',
                    title     : this.test.title,
                    itemType  : 'Text',
                    canAdd    : true,
                    canEdit   : true,
                    canReorder: true,
                    canDelete : true
                }
            }
        }, data      = {
            tasks: ['Hello, world 0']
        };
        valueManager.setValue(data);
        const root = into(<Form key='editAValue' schema={schema}
                                valueManager={valueManager}/>,
            debug);
        edit(root, 0);
    });
    it('should render edit a value with an error', function () {
        const { Form } = newContext();

        const schema = {
            schema: {
                tasks: {
                    type      : 'List',
                    title     : this.test.title,
                    itemType  : 'Text',
                    canAdd    : true,
                    canEdit   : true,
                    canReorder: true,
                    canDelete : true
                }
            }
        }, data      = {
            tasks: ['one', 'two']
        }, errors    = {
            'tasks.1': [{ message: 'Can not be 2' }]
        };
        const root   = into(<Form key='form4' schema={schema} value={data}
                                  errors={errors}/>,
            debug);
        const found  = TestUtils.scryRenderedComponentsWithType(root,
            EditorTemplate);
        expect(found[0].props.error).toEqual('Can not be 2');
    });
});
