"use strict";

import React, {Component} from "react";
import {injector, PropTypes} from 'Subschema';
import expect from 'expect';

describe("cachedInjector", function () {
    this.timeout(5000);
    class TestComponent extends Component {
        render() {
            return <div>hello</div>
        }
    }
    it('should return the same instance without args', function () {
        const C1 = injector.inject(TestComponent);
        const C2 = injector.inject(TestComponent);
        expect(C1).toBe(C2);
    });
    it('should return the same instance with empty args', function () {
        const C1 = injector.inject(TestComponent, {}, {});
        const C2 = injector.inject(TestComponent, {}, {});
        expect(C1).toBe(C2);
    });
    it('should return different instances with different values', function () {
        const C1 = injector.inject(TestComponent, {}, {value: "stuff"});
        const C2 = injector.inject(TestComponent, {}, {});
        expect(C1).toNotBe(C2);
        const C3 = injector.inject(TestComponent, {}, {});
        const C4 = injector.inject(TestComponent, {}, {value: "stuff"});
        expect(C3).toNotBe(C4);
    });
    it('should return different instances with different propTypes', function () {
        const C1 = injector.inject(TestComponent, {value: PropTypes.value}, {});
        const C2 = injector.inject(TestComponent, {}, {});
        expect(C1).toNotBe(C2);
        const C3 = injector.inject(TestComponent, {}, {});
        const C4 = injector.inject(TestComponent, {value: PropTypes.value}, {});
        expect(C3).toNotBe(C4);

    });
    it('should return same instances with same propTypes', function () {
        const C1 = injector.inject(TestComponent, {value: PropTypes.value}, {});
        const C2 = injector.inject(TestComponent, {value: PropTypes.value}, {});
        expect(C1).toBe(C2);
        const C3 = injector.inject(TestComponent, {value: PropTypes.value}, {});
        const C4 = injector.inject(TestComponent, {value: PropTypes.value}, {});
        expect(C3).toBe(C4);
    });
});