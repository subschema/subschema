import expect from 'expect';
import {tutils} from 'subschema';

const {inherits} = tutils;

describe('tutil', function () {
    this.timeout(20000);

    describe('::inherits', function () {
        class A {

        }
        class B extends A {

        }
        class C extends B {

        }
        it('A inherits from A', function () {
            expect(A::inherits(A)).toBe(true);
            expect(A::inherits(null)).toBe(false);
        });
        it('B inherits from A', function () {
            expect(B::inherits(A)).toBe(true);
            expect(A::inherits(B)).toBe(false);
        });
        it('C inherits from A', function () {
            expect(C::inherits(A)).toBe(true);
            expect(A::inherits(C)).toBe(false);
        });
        it('C does not inherit from null', function () {
            expect(C::inherits(null)).toBe(false);
        });
        it('C does not inherit from {}', function () {
            expect(C::inherits({})).toBe(false);
        });
        it('C does not inherit from Object', function () {
            expect(C::inherits(Object)).toBe(false);
        });
    });
});