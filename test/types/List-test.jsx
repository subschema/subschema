describe('List', function () {
    var React = require('react/addons');
    var TestUtils = require('react/lib/ReactTestUtils');
    var expect = require('expect');
    var Form = require('subschema').Form;
    var Simulate = React.addons.TestUtils.Simulate;
    var Buttons = require('../../src/templates/ButtonsTemplate.jsx');
    var Button = require('../../src/templates/ButtonTemplate.jsx');
    var ListTemplate = require('../../src/templates/ListItemTemplate.jsx');
    var CreateTemplate = require('../../src/templates/CollectionCreateTemplate.jsx');
    this.timeout(50000);
    function into(node, attach) {
        return attach ? React.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
    }

    function click(node) {
        Simulate.click(node.getDOMNode ? node.getDOMNode() : node);
    }

    function byTag(node, tag) {
        return TestUtils.findRenderedDOMComponentWithTag(node, tag);
    }

    function byComponent(node, comp) {
        return TestUtils.scryRenderedComponentsWithType(node, comp)[0];
    }

    function byComponents(node, comp) {
        return TestUtils.scryRenderedComponentsWithType(node, comp);
    }

    function add(root, c) {
        var refs = root.refs.tasks.refs.field.refs;
        var addBtn = TestUtils.scryRenderedComponentsWithType(root, Button)[0];

        click(addBtn);
        var create = TestUtils.scryRenderedComponentsWithType(root, CreateTemplate)[0];
        var input = byTag(create, 'input');
        Simulate.change(input, {target: {value: 'Hello, world ' + c}});
        click(create.refs.submitBtn);

        var value = root.getValue();
        expect(value.tasks[c]).toEqual('Hello, world ' + c);
        var tasks = root.refs.tasks.refs.field.refs;
        return tasks['tasks_' + c].refs
    }

    function edit(root, c) {
        var tasks = root.refs.tasks.refs.field.refs;
        Simulate.click(tasks['tasks_' + c].refs.edit);
        var input = tasks.addEdit.refs.itemEditor.refs.field.refs.value.refs.field.refs.input;
        Simulate.change(input, {target: {value: 'Hello, world ' + c}});
        Simulate.click(tasks.addEdit.refs.submitBtn);
        var value = root.getValue();
        expect(value.tasks[c]).toEqual('Hello, world ' + c);
        var tasks = root.refs.tasks.refs.field.refs;
        return tasks['tasks_' + c].refs
    }

    var Todos = require('../../public/samples/Todos'), Schema = Todos.schema;
    it('should render a list', function () {
        var root = into(<Form schema={Schema}/>);
        expect(root).toExist();
        expect(root.refs.tasks).toExist();
        expect(root.refs.tasks.refs.field.refs.tasks_0).toNotExist();
        expect(root.refs.tasks.refs.field.refs.tasks_1).toNotExist();
        expect(root.refs.tasks.refs.field.refs.tasks_2).toNotExist();
    });
    it('should render a list with data the canAdd', function () {
        var data = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        };
        var root = into(<Form schema={Schema} value={data}/>);
        expect(root).toExist();
        expect(root.refs.tasks).toExist();
        expect(root.refs.tasks.refs.field.refs.addBtn).toExist();
        var tasks = byComponents(root, ListTemplate);

        expect(tasks[0].refs.buttons.refs.upBtn).toNotExist();
        expect(tasks[0].refs.buttons.refs.deleteBtn).toExist();
        expect(tasks[0].refs.buttons.refs.downBtn).toExist();
        expect(tasks[1].refs.buttons.refs.upBtn).toExist();
        expect(tasks[1].refs.buttons.refs.deleteBtn).toExist();
        expect(tasks[1].refs.buttons.refs.downBtn).toExist();

        expect(tasks[2].refs.buttons.refs.upBtn).toExist();
        expect(tasks[2].refs.buttons.refs.deleteBtn).toExist();
        expect(tasks[2].refs.buttons.refs.downBtn).toNotExist();


    });
    it('should render a list with data without canAdd', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text',
                    canEdit: true,
                    canReorder: true,
                    canDelete: true
                }
            }
        }, data = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        }
        var root = into(<Form schema={schema} value={data}/>);
        var tasks = root.refs.tasks.refs.field.refs
        expect(tasks.addBtn).toNotExist();
        expect(tasks.tasks_0).toExist();
        expect(tasks.tasks_1).toExist();
        expect(tasks.tasks_2).toExist();
        var li = byComponents(root, ListTemplate)[0];
        click(li.refs.edit);
        var edit = byComponent(root, CreateTemplate);
        var input = byTag(edit, 'input');
        expect(input.getDOMNode().value).toBe('one');

    });
    it('should render a list with data is not editable', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text'
                }
            }
        }, data = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        }
        var root = into(<Form schema={schema} value={data}/>);

        expect(root.refs.tasks.refs.field.refs.addBtn).toNotExist();
        var tasks = byComponents(root, ListTemplate);
        expect(tasks.length).toBe(3);
        tasks.forEach(function (task) {
            task = task.refs.buttons.refs;
            expect(task.upBtn).toNotExist();
            expect(task.deleteBtn).toNotExist();
            expect(task.downBtn).toNotExist();

            expect(task.upBtn).toNotExist();
            expect(task.deleteBtn).toNotExist();
            expect(task.downBtn).toNotExist();

            expect(task.upBtn).toNotExist();
            expect(task.deleteBtn).toNotExist();
            expect(task.downBtn).toNotExist();
        })
    });

    it('should render a list without data and add values', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text',
                    canAdd: true,
                    canEdit: true,
                    canReorder: true,
                    canDelete: true
                }
            }
        }, data = {
            tasks: []
        }
        var root = into(<Form schema={schema} value={data}/>);
        expect(root).toExist();
        expect(root.refs.tasks).toExist();


        var a0 = add(root, 0).buttons.refs;
        expect(a0.upBtn).toNotExist();
        expect(a0.deleteBtn).toExist();
        expect(a0.downBtn).toNotExist();
        var a1 = add(root, 1).buttons.refs;
        expect(a1.upBtn).toExist();
        expect(a1.deleteBtn).toExist();
        expect(a1.downBtn).toNotExist();

        var a2 = add(root, 2).buttons.refs;
        expect(a2.upBtn).toExist();
        expect(a2.deleteBtn).toExist();
        expect(a2.downBtn).toNotExist();
        expect(a1.downBtn).toExist();


        click(a0.deleteBtn);
        expect(root.getValue().tasks.length).toEqual(2);
        click(a1.deleteBtn);
        expect(root.getValue().tasks.length).toEqual(1);
        click(a2.deleteBtn);
        expect(root.getValue().tasks.length).toEqual(0);


    });
    it('should render edit a value', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text',
                    canAdd: true,
                    canEdit: true,
                    canReorder: true,
                    canDelete: true
                }
            }
        }, data = {
            tasks: ['Hello, world 0']
        }
        var root = into(<Form schema={schema} value={data}/>);
        edit(root, 0);
    });
    it('should render edit a value with an error', function () {
        var EditorTemplate = require('../../src/templates/EditorTemplate.jsx');
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text',
                    canAdd: true,
                    canEdit: true,
                    canReorder: true,
                    canDelete: true
                }
            }
        }, data = {
            tasks: ['one', 'two']
        }, errors = {
            'tasks.1': [{message: 'Can not be 2'}]
        }
        var root = into(<Form schema={schema} value={data} errors={errors}/>);
        var found = TestUtils.scryRenderedComponentsWithType(root, EditorTemplate);
        expect(found[0].state.error).toEqual('Can not be 2');
    });
})