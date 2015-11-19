import subschema from 'Subschema';
import expect from 'expect';
import React, {Component}  from 'react';

var bindAll = subschema.decorators.bindAll;


describe('bindAll', function () {
    this.timeout(50000);
    it('should bind all', function () {

        @bindAll
        class MyClass {
            constructor(init = 1) {
                this.init = init;
            }

            add(num) {
                return this.init + num;
            }

        }
        var m = new MyClass();

        var add = m.add;
        expect(add(2)).toBe(3);

        var two = m.add(2);
        expect(two).toBe(3);

    });
    it('should bind include add', function () {

        @bindAll(['add'])
        class MyClass {
            constructor(init = 1) {
                this.init = init;
            }

            add(num) {
                return this.init + num;
            }

            notadd(num) {
                return this;
            }

        }
        var m = new MyClass(), add = m.add, notadd = m.notadd;
        expect(add(2)).toBe(3);
        expect(notadd()).toNotExist();
        var two = m.add(2);
        expect(two).toBe(3);

    });
    it('should bind exclude notadd', function () {

        @bindAll(null, [/^notadd$/])
        class MyClass {
            constructor(init = 1) {
                this.init = init;
            }

            add(num) {
                return this.init + num;
            }

            notadd(num) {
                return this;
            }

        }
        var m = new MyClass(), add = m.add, notadd = m.notadd;
        expect(add(2)).toBe(3);
        expect(notadd()).toNotExist();
        var two = m.add(2);
        expect(two).toBe(3);

    })
    it('should bind exclude notadd and not add', function () {

        @bindAll(['add'], [/^notadd$/])
        class MyClass {
            constructor(init = 1) {
                this.init = init;
            }

            add(num) {
                return this.init + num;
            }

            notadd(num) {
                return this;
            }

        }
        var m = new MyClass(), add = m.add, notadd = m.notadd;
        expect(add(2)).toBe(3);
        expect(notadd()).toNotExist();
        var two = m.add(2);
        expect(two).toBe(3);

    })

});