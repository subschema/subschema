"use strict";
import ValueManager from '../src/FastValueManager';

import expect from 'expect';

describe('FastValueManager', function () {
    this.timeout(20000);
    describe('value handling', function () {
        it('should add a listener and fire on change', function (done) {
            var vm = new ValueManager();
            var scope = {};
            vm.addListener('stuff', function (newValue, oldValue, path) {
                expect(newValue).toEqual(1);
                expect(path).toEqual('stuff');
                done();
            }, scope);
            vm.setValue({
                stuff: 1
            });

        });
        it('should add a listener and fire on change when it is nested', function (done) {
            var vm = new ValueManager();
            vm.addListener('stuff.more', function (newValue, oldValue, path) {
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
                    expect(newValue).toEqual(false);
                    expect(path).toEqual('stuff.more');
                    first = false;
                } else {
                    //here
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
                    expect(newValue).toEqual(false);
                    expect(path).toEqual('stuff.more');
                    first = false;
                } else {
                    expect(newValue).toNotExist();
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
            const vm = new ValueManager();
            let first = true;
            vm.addListener('stuff.more', function (newValue, oldValue, path) {
                if (first) {
                    expect(newValue).toEqual(false);
                    expect(path).toEqual('stuff.more');
                    first = false;
                } else {
                    expect(newValue).toNotExist();
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
            });
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
            });
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
                /*{

                 other: true
                 }*/
            );
            var fired = false;
            vm.addListener('stuff', function (newValue, oldValue, path) {
                expect(newValue[0].more).toEqual(false);
                expect(path).toEqual('stuff');
                fired = true;
            });
            vm.update('stuff.0.more', false);
            var val = vm.getValue();
            expect(val.stuff[0].more).toEqual(false);
            //   expect(val.other).toEqual(true);
            expect(fired).toEqual(true);
        });
        it('should replace all the keys', function () {
            var vm = new ValueManager(
                {

                    other: true,
                    more: 'stuff'
                }
            );
            vm.setValue({test: 1, other: false});
            var val = vm.getValue();
            expect(val.other).toEqual(false);
            expect(val.more).toNotExist();
            expect(val.test).toEqual(1);
        });
        it('should fire nested handlers when passing null', function () {
            const vm = ValueManager();
            let args = [];

            function listen(...arg) {
                args.push(arg);
            }

            const r1 = vm.addListener('stuff', listen).remove;
            const r2 = vm.addListener('stuff.to.there', listen).remove;

            vm.update('stuff', null);
            expect(args[0][2]).toBe('stuff');
            expect(args[1][2]).toBe('stuff.to.there');
            expect(args.length).toBe(2);
            expect(vm.listeners.size).toBe(2);
            r1();
            expect(vm.listeners.size).toBe(1);
            r2();
            expect(vm.listeners.size).toBe(0);
        });
        it('should fire nested handlers when passing object', function () {
            const vm = ValueManager({other: {stuff: true}});
            let args = [];

            function listen(...arg) {
                args.push(arg);
            }

            const r1 = vm.addListener('stuff', listen).remove;
            const r2 = vm.addListener('stuff.to.there', listen).remove;

            vm.update('stuff', {to: {there: 1}});
            expect(args[0][2]).toBe('stuff');
            expect(args[0][0].to.there).toBe(1);
            expect(args[1][2]).toBe('stuff.to.there');
            expect(args.length).toBe(2);
            expect(vm.listeners.size).toBe(2);
            r1();
            expect(vm.listeners.size).toBe(1);
            r2();
            expect(vm.listeners.size).toBe(0);
        })

    });
    describe('error handling', function () {

        it('should have errors', function () {
            var vm = ValueManager({other: true}, {other: [{message: 'Has Error'}]});
            var errors = vm.getErrors()['other'];
            expect(errors.length).toEqual(1);
            expect(errors[0].message).toEqual('Has Error');

        });
        it('should have errors nested errors', function () {
            var vm = ValueManager({other: {more: 'stuff'}}, {
                other: [{message: 'Has Error'}],
                'other.more': [{message: 'More'}]
            });
            var err = vm.getErrors();
            expect(err['other'][0].message).toEqual('Has Error');
            expect(err['other.more'][0].message).toEqual('More');

        });
        it('should fire error listeners', function () {
            var vm = ValueManager();
            var errors = [];
            var remove = vm.addErrorListener('other', function () {
                errors.push(Array.prototype.slice.call(arguments));
            }).remove;
            vm.updateErrors('other', [{message: 'Has Error'}]);
            expect(errors.length).toEqual(1);

            vm.updateErrors('other.more', {message: 'Has More'});
            expect(errors.length).toEqual(2);

            var e = vm.getErrors();
            expect(e['other.more'].length).toEqual(1);
            expect(e['other'].length).toEqual(1);
            vm.updateErrors('other', null);
            var e = vm.getErrors();
            expect(e['other']).toNotExist();
            expect(vm.errors.size).toBe(1);
            remove();
            expect(vm.errors.size).toBe(0);
        });
    });
    describe('validate', function () {

        it('should trigger validators', function () {
            const vm = ValueManager({
                stuff: 'stuffy'
            });
            const args = [];
            const listen = (...a) => args.push(a);
            const r1 = vm.addValidateListener('stuff', listen).remove;
            const r2 = vm.addValidateListener('other', listen).remove;
            vm.validate('stuff');

            expect(args[0][0]).toBe('stuffy')
            expect(args.length).toBe(1);

            expect(vm.validators.size).toBe(2);
            r1();
            expect(vm.validators.size).toBe(1);
            r2();
            expect(vm.validators.size).toBe(0);


        });
        it('should trigger all validators', function () {
            const vm = ValueManager({
                stuff: 'stuffy'
            });
            const args = [];
            const listen = (...a) => args.push(a);
            const r1 = vm.addValidateListener('stuff', listen).remove;
            const r2 = vm.addValidateListener('other', listen).remove;
            vm.validate();

            expect(args[0][0]).toBe('stuffy')
            expect(args[1][0]).toNotExist();

            expect(args.length).toBe(2);

            expect(vm.validators.size).toBe(2);
            r1();
            expect(vm.validators.size).toBe(1);
            r2();
            expect(vm.validators.size).toBe(0);


        });

    })
});