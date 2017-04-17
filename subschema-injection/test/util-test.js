import {onlyKeys} from "../src/util";
import expect from "expect";

describe('util', function () {

    it('should return only unique keys', function () {

        const ret = onlyKeys(['stuff', 'me'], {stuff: 1, other: 2}, {more: 3}, {me: 4});

        expect(ret.stuff).toBe(1);
        expect(ret.me).toBe(4);
        expect(Object.keys(ret).length).toBe(2);

    });

});