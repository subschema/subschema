"use strict";
import expect from 'expect';
import injectorFactory from '../src/injectorFactory';
const RESOLVER = new Map();
const listen = _ => {
};

const property = _ => {
};

const extend = _ => {
};
const nope = _=> {
};

RESOLVER.set(nope, function (Clazz, key) {
    Clazz::this.listen((value, key, props, context)=> {

    });
});

describe('injectorFactory', function () {

    it('should return the original class', function () {
        class Empty {

        }
        const injF = injectorFactory(RESOLVER);
        expect(injF.inject(Empty)).toBe(Empty);
    });
    it('should return the original class with props', function () {
        class Empty {
            static defaultProps = {
                stuff: 0
            };
            static propTypes = {
                whatever: function () {
                }
            }
        }
        const injF = injectorFactory(RESOLVER);
        expect(injF.inject(Empty)).toBe(Empty);
    });
    it('should inject listener', function () {
        const invoked = [];

        function listenTest(Clazz, key) {
            Clazz::this.listener((...args)=> {
                invoked.push(args);
            });
        }

        class ListenToMe {
            static defaultProps = {
                stuff: 0
            };
            static propTypes = {
                whatever: listenTest
            };

            render() {
                return <span>{this.props.whatever}</span>
            }
        }

        const injF = injectorFactory();
        injF.resolver(listenTest, listenTest);
        expect(injF.inject(ListenToMe)).toNotBe(ListenToMe);
        expect(invoked.length).toBe(0);

    });
});