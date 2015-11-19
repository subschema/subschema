import subschema from 'Subschema';
import expect from 'expect';
var bind = subschema.decorators.bind;

describe('bind', function () {
    this.timeout(50000);
    it('should bind methods to class with args', function () {
        var args = [1];
        var f = function () {
            return args;
        }
        class TestClass2 {
            constructor() {
                this.inst = true;
            }

            @bind(args)
            args(...aaa) {
                aaa.unshift(this);
                return aaa;
            }
        }
        var me = new TestClass2(), result;
        result = me.args('hello');
        expect(result[0]).toBe(me, 'args returns the scope');
        expect(result[1]).toBe(1, 'args returns the bound value');
        expect(result[2]).toBe('hello', 'args returns the first argument');


        var stuff = me.args;
        result = stuff('a');
        expect(result[0]).toBe(me, 'args returns the scope');
        expect(result[1]).toBe(1, 'args returns the bound value');
        expect(result[2]).toBe('a', 'args returns the first argument');
        args.push(2);
        result = stuff('a');
        expect(result[0]).toBe(me, 'args returns the scope');
        expect(result[1]).toBe(1, 'args returns the bound value');
        expect(result[2]).toBe(2, 'args returns the second argument');
        expect(result[3]).toBe('a', 'args returns the first argument');


    });
    it('should bind methods to class', function () {

        class MyClass {
            constructor() {
                this.inst = true;
            }

            @bind
            stuff() {
                return this;
            }

            @bind
            other(val) {
                return [this, val];
            }

            @bind([1])
            args(val, arg) {
                return [this, val, arg];
            }
        }
        var me = new MyClass(), stuff = me.stuff, other = me.other, args = me.args, result;
        result = stuff();
        expect(result).toBe(me, 'stuff return the scope');
        result = other('a');
        expect(result[0]).toBe(me, 'other return the scope');
        expect(result[1]).toBe('a', 'other return the first arg');

        result = args('a');

        expect(result[0]).toBe(me, 'args returns the scope');
        expect(result[1]).toBe(1, 'args returns the bound value');
        expect(result[2]).toBe('a', 'args returns the first argument');
    });
    it('work as documented', function () {

        class MyClass {
            constructor() {
                this.init = 1;
            }

            @bind
            stuff() {
                return this.init;
            }

            @bind([2])
            //the first argument will be passed in.
            multiplyPlus(multiply, plus) {
                return this.init * multiply + plus
            }
        }
        var m = new MyClass();
        expect(m.stuff()).toBe(1);
        //1;

        var stuff = m.stuff;
        expect(stuff()).toBe(1);
        //1

        var timesPlus = m.multiplyPlus;
        expect(timesPlus(3)).toBe(5);


    });
    it('set the stuff', function () {

        class MyClass {
            constructor(init) {
                this.init = init;
            }

            @bind
            stuff() {
                return this.init;
            }

            @bind([2])
            //the first argument will be passed in.
            multiplyPlus(multiply, plus) {
                return (this.init * multiply) + plus;
            }
        }
        var m = new MyClass(2), m2 = new MyClass(3);
        m.stuff = function (arg) {
            return this.init * arg;
        }

        var mp = m.multiplyPlus;
        var stuff = m.stuff;
        expect(stuff(2)).toBe(4);
        expect(stuff(3)).toBe(6);
        expect(mp(2)).toBe(6);

        var mp2 = m2.multiplyPlus;
        var stuff2 = m2.stuff;
        expect(stuff2(2)).toBe(6);
        expect(stuff2(3)).toBe(9);
        expect(mp2(2)).toBe(8);

    })
});