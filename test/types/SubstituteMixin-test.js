import expect from 'expect';
import {types} from 'Subschema';

var {SubstituteMixin} = types;

describe.only('Substitute', function () {
    this.timeout(50000);

    it('should substitute nicely', function () {

        var res = SubstituteMixin('{hello}');
        expect(res.listen.length).toBe(1, 'check length of listen')
        expect(res.listen[0]).toBe('hello', 'check value');

        expect(res.format({hello: 'joe'})).toBe('joe', 'substitute the value');
    });
    it('should substitute escape values', function () {

        var res = SubstituteMixin('{hello}');
        expect(res.listen.length).toBe(1, 'check length of listen')
        expect(res.listen[0]).toBe('hello', 'check value');
        var value = res.format({hello: '<h1>joe</h1>'});
        expect(value).toBe("&lt;h1&gt;joe&lt;/h1&gt;", 'substitute the value');
    });
    it('should substitute multiple values', function () {

        var res = SubstituteMixin('\'{hello} cruel <b>{world}</b>');
        expect(res.listen.length).toBe(2, 'check length of listen')

        var value = res.format({hello: '<h1>joe</h1>', world:'is cool'});
        expect(value).toBe("\'&lt;h1&gt;joe&lt;/h1&gt; cruel <b>is cool</b>", 'substitute the value');
    });
    it('should substitute multiple values wierd', function () {

        var res = SubstituteMixin('{h\'ello} cruel <b>{world}</b>');
        expect(res.listen.length).toBe(2, 'check length of listen')

        var value = res.format({hello: '<h1>joe</h1>', world:'is cool'});
        expect(value).toBe(" cruel <b>is cool</b>", 'substitute the value');
    });

    it('should substitute multiple values wierd', function () {

        var res = SubstituteMixin('{h\"ello} \"cruel <b>{world}</b>');
        expect(res.listen.length).toBe(2, 'check length of listen')

        var value = res.format({hello: '<h1>joe</h1>', world:'is cool'});
        expect(value).toBe(" \"cruel <b>is cool</b>", 'substitute the value');
    });

});