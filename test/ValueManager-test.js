var expect = require('expect'), ValueManager = require('../src/ValueManager');
describe.only('ValueManager', function () {
    it('should add a listener and fire on change', function (done) {
        var vm = new ValueManager();
        vm.addListener('stuff', function (newValue, oldValue, path) {
            expect(oldValue).toNotExist();
            expect(newValue).toEqual(1);
            expect(path).toEqual('stuff');
            done();
        });
        vm.setValue({
            stuff: 1
        });

    });
    it('should add a listener and fire on change when it is nested', function (done) {
        var vm = new ValueManager();
        vm.addListener('stuff.more', function (newValue, oldValue, path) {
            expect(oldValue).toNotExist();
            expect(newValue).toEqual(false);
            expect(path).toEqual('stuff.more');
            done();

        });
        vm.setValue({
            stuff: {
                more: false
            }
        });

    });
    it('should add a listener and fire on change when it is nested and changes', function (done) {
        var vm = new ValueManager();
        var first = true;
        vm.addListener('stuff.more', function (newValue, oldValue, path) {
            if (first) {
                expect(oldValue).toNotExist();
                expect(newValue).toEqual(false);
                expect(path).toEqual('stuff.more');
                first = false;
            } else {
                expect(oldValue).toEqual(false);
                expect(newValue).toEqual(true);
                expect(path).toEqual('stuff.more');


                done();
            }

        });
        vm.setValue({
            stuff: {
                more: false
            }
        });
        vm.setValue({
            stuff: {
                more: true
            }
        });
    });

    it('should add a listener and fire on change when it is nested and changes to null', function (done) {
        var vm = new ValueManager();
        var first = true;
        vm.addListener('stuff.more', function (newValue, oldValue, path) {
            if (first) {
                expect(oldValue).toNotExist();
                expect(newValue).toEqual(false);
                expect(path).toEqual('stuff.more');
                first = false;
            } else {
                expect(oldValue).toEqual(false);
                expect(newValue).toEqual(null);
                expect(path).toEqual('stuff.more');

                done();
            }

        });
        vm.setValue({
            stuff: {
                more: false
            }
        });
        vm.setValue({
            stuff: null
        });
    });
    it('should add a listener and fire on change when it is nested and changes to all null', function (done) {
        var vm = new ValueManager();
        var first = true;
        vm.addListener('stuff.more', function (newValue, oldValue, path) {
            if (first) {
                expect(oldValue).toNotExist();
                expect(newValue).toEqual(false);
                expect(path).toEqual('stuff.more');
                first = false;
            } else {
                expect(oldValue).toEqual(false);
                expect(newValue).toEqual(null);
                expect(path).toEqual('stuff.more');

                done();
            }

        });
        vm.setValue({
            stuff: {
                more: false
            }
        });
        vm.setValue(null);
    });
    it('should add a listener and remove a listener', function (done) {
        var vm = new ValueManager();
        var fired = 0;
        var added = vm.addListener('stuff.more', function (newValue, oldValue, path) {
            fired++;
        });
        vm.setValue({
            stuff: {
                more: false
            }
        });
        vm.removeListener(added);
        vm.addListener('stuff.more', function () {
            expect(fired).toEqual(1);
            done();
        })
        vm.setValue(null);
    });
    it('should add a listener and remove a listener by path', function (done) {
        var vm = new ValueManager();
        var fired = 0;
        var added = vm.addListener('stuff.more', function (newValue, oldValue, path) {
            fired++;
        });
        vm.setValue({
            stuff: {
                more: false
            }
        });
        vm.removeListener('stuff.more');
        vm.addListener('stuff.more', function () {
            expect(fired).toEqual(1);
            done();
        })
        vm.setValue(null);
    });
    it('should update change when it is nested', function () {
        var vm = new ValueManager(
            {
                stuff: {
                    more: true
                },
                other: true
            }
        );
        var fired = false;
        vm.addListener('stuff.more', function (newValue, oldValue, path) {
            expect(oldValue).toEqual(true);
            expect(newValue).toEqual(false);
            expect(path).toEqual('stuff.more');
            fired = true;
        });
        vm.update('stuff.more', false);
        var val = vm.getValue();
        expect(val.stuff.more).toEqual(false);
        expect(val.other).toEqual(true);
        expect(fired).toEqual(true);
    });
    it('should update change when it is nested and no value', function () {
        var vm = new ValueManager(
            {

                other: true
            }
        );
        var fired = false;
        vm.addListener('stuff.more', function (newValue, oldValue, path) {
            expect(oldValue).toNotExist();
            expect(newValue).toEqual(false);
            expect(path).toEqual('stuff.more');
            fired = true;
        });
        vm.update('stuff.more', false);
        var val = vm.getValue();
        expect(val.stuff.more).toEqual(false);
        expect(val.other).toEqual(true);
        expect(fired).toEqual(true);
    });
    it('should create an array', function () {
        var vm = new ValueManager(
            {

                other: true
            }
        );
        var fired = false;
        vm.addListener('stuff', function (newValue, oldValue, path) {
            expect(oldValue).toNotExist();
            expect(newValue).toEqual(false);
            expect(path).toEqual('stuff.0.more');
            fired = true;
        });
        vm.update('stuff.0.more', false);
        var val = vm.getValue();
        expect(val.stuff[0].more).toEqual(false);
        expect(val.other).toEqual(true);
        expect(fired).toEqual(true);
    });
});