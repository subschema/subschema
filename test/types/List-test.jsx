describe('List', function () {
    var React = require('react/addons');
    var TestUtils = require('react/lib/ReactTestUtils');
    var expect = require('expect');
    var Form = require('subschema').Form;
    var Simulate = React.addons.TestUtils.Simulate;
    this.timeout(50000);
    function into(node) {
      //  return React.render(node, document.getElementsByTagName('body')[0]);
       return TestUtils.renderIntoDocument(node);
    }
    function add(root, c) {
        var refs = root.refs.tasks.refs.field.refs;
        Simulate.click(refs.addBtn);
        var input = refs.addEdit.refs.itemEditor.refs.field.refs.value.refs.field.refs.input;
        Simulate.change(input, {target: {value: 'Hello, world ' + c}});
        Simulate.click(refs.addEdit.refs.submitBtn);
        var value = root.getValue();
        expect(value.tasks[c]).toEqual('Hello, world ' + c);
        var tasks = root.refs.tasks.refs.field.refs;
        return tasks['tasks_' + c].refs
    }
    function edit(root, c){
        var tasks = root.refs.tasks.refs.field.refs;
        Simulate.click(tasks['tasks_'+c].refs.edit);
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
        var tasks = root.refs.tasks.refs.field.refs

        expect(tasks.tasks_0.refs.upBtn).toNotExist();
        expect(tasks.tasks_0.refs.deleteBtn).toExist();
        expect(tasks.tasks_0.refs.downBtn).toExist();

        expect(tasks.tasks_1.refs.upBtn).toExist();
        expect(tasks.tasks_1.refs.deleteBtn).toExist();
        expect(tasks.tasks_1.refs.downBtn).toExist();

        expect(tasks.tasks_2.refs.upBtn).toExist();
        expect(tasks.tasks_2.refs.deleteBtn).toExist();
        expect(tasks.tasks_2.refs.downBtn).toNotExist();


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
        var tasks = root.refs.tasks.refs.field.refs;

        expect(tasks.tasks_0.refs.upBtn).toNotExist();
        expect(tasks.tasks_0.refs.deleteBtn).toNotExist();
        expect(tasks.tasks_0.refs.downBtn).toNotExist();

        expect(tasks.tasks_1.refs.upBtn).toNotExist();
        expect(tasks.tasks_1.refs.deleteBtn).toNotExist();
        expect(tasks.tasks_1.refs.downBtn).toNotExist();

        expect(tasks.tasks_2.refs.upBtn).toNotExist();
        expect(tasks.tasks_2.refs.deleteBtn).toNotExist();
        expect(tasks.tasks_2.refs.downBtn).toNotExist();

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


        var a0 = add(root, 0);
        expect(a0.upBtn).toNotExist();
        expect(a0.deleteBtn).toExist();
        expect(a0.downBtn).toNotExist();
        var a1 = add(root, 1);
        expect(a1.upBtn).toExist();
        expect(a1.deleteBtn).toExist();
        expect(a1.downBtn).toNotExist();
        var a2 = add(root, 2);
        expect(a2.upBtn).toExist();
        expect(a2.deleteBtn).toExist();
        expect(a2.downBtn).toNotExist();
        expect(a1.downBtn).toExist();

        Simulate.click(a0.deleteBtn);
        expect(root.getValue().tasks.length).toEqual(2);
        Simulate.click(a1.deleteBtn);
        expect(root.getValue().tasks.length).toEqual(1);
        Simulate.click(a2.deleteBtn);
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
            tasks: ['one']
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
            'tasks.1':[{ message:'Can not be 2' }]
        }
        var root = into(<Form schema={schema} value={data} errors={errors}/>);
        var found  = TestUtils.scryRenderedComponentsWithType(root, EditorTemplate);
        expect(found[0].state.error).toEqual('Can not be 2');
    });
})