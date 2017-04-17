"use strict";
import React from 'react';
import {
    byName,
    into,
    findNode,
    TestUtils,
    expect,
    filterProp,
    byClass,
    Simulate,
    click,
    byTag,
    byComponent,
    byComponents
} from 'subschema-test-support';
import {templates, Form} from 'Subschema';
import {Todos} from 'subschema-test-samples';

const {ButtonTemplate, ListItemTemplate, CollectionCreateTemplate} = templates;

function controlBtn(task, action) {
    return filterProp(byComponents(task, ButtonTemplate), 'action', action)[0];
}

describe('public/Todos', function () {
    this.timeout(50000);
    function add(root, c) {
        var allBtns = TestUtils.scryRenderedComponentsWithType(root, ButtonTemplate);
        var addBtn = findNode(allBtns[0]);

        click(addBtn);
        var create = byComponent(root, CollectionCreateTemplate);
        var input = byTag(create, 'input');
        Simulate.change(input, {target: {value: 'Hello, world ' + c}});
        var buttons = TestUtils.scryRenderedComponentsWithType(create, ButtonTemplate);
        expect(buttons[0]).toExist('buttons[0] does not exist');
        var btn = findNode(filterProp(buttons, 'action', 'submit')[0]);
        Simulate.click(btn);

        var value = root.getValue();
        expect(value.tasks[c]).toEqual('Hello, world ' + c);
        var tasks = byComponents(root, ListItemTemplate);
        return tasks[c];
    }


    it('should render a list', function () {
        var root = into(<Form schema={Todos.schema}/>, true);
        expect(root).toExist();
        var tasks = byComponents(root, ListItemTemplate);
        expect(tasks.length).toEqual(0);

    });
    it('should render a list with data', function () {
        var root = into(<Form schema={Todos.schema} value={Todos.data}/>, true);
        expect(root).toExist();
        var tasks = byComponents(root, ListItemTemplate);
        expect(tasks.length).toEqual(3);
        const [first, second, last] = byComponents(root, ListItemTemplate);
        click(byClass(second, 'clickable')[0]);
    });

    it('should render a list with data the canAdd', function () {
        const data = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        };
        const root = into(<Form schema={Todos.schema} value={data}/>, true);

        expect(root).toExist('root should exist');

        const addBtn = byClass(root, 'btn-add', 0)[0];

        expect(addBtn).toExist('add btn should exit');

        const [first, second, last] = byComponents(root, ListItemTemplate);

        expect(controlBtn(first, 'up')).toNotExist();
        expect(controlBtn(first, 'down')).toExist();
        expect(controlBtn(first, 'delete')).toExist();


        expect(controlBtn(second, 'up')).toExist();
        expect(controlBtn(second, 'down')).toExist();
        expect(controlBtn(second, 'delete')).toExist();

        expect(controlBtn(last, 'up')).toExist();
        expect(controlBtn(last, 'delete')).toExist();
        expect(controlBtn(last, 'down')).toNotExist();


    });
});