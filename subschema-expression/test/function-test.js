import expect from 'expect';
import expression from '../lib';



describe('expression/function', function () {
    this.timeout(50000);
    it('should parse out functions', function () {
        var expr = expression('{stuff(name)} {other}');
        expect(expr.listen[0]).toBe('name');
        expect(expr.listen[1]).toBe('other');
        expect(expr.formatters[0]).toBe('stuff');
    });
    it('should parse out function with multiple args', function () {
        var expr = expression(`hello { stuff(name, other) } {more}`);
        expect(expr.listen[0]).toBe('name');
        expect(expr.listen[1]).toBe('other');
        expect(expr.listen[2]).toBe('more');
        expect(expr.formatters[0]).toBe('stuff');

        var res = expr.format({
            more: 1,
            other: true,
            name: 'Joe<b/>'
        }, {
            stuff: function (a, b) {
                return `<h1>${a}-${b}</h1>`;
            }
        });
        expect(res, "hello &lt;h1&gt;Joe&lt;b/&gt;-true&lt;/h1&gt; 1");
    });

    it('should parse out function with multiple args literal', function () {
        var expr = expression(`hello { join(name, 'huh', "what") } {more}`);
        expect(expr.listen[0]).toBe('name');
        expect(expr.listen[1]).toBe('more');
        expect(expr.listen.length).toBe(2);
        expect(expr.formatters[0]).toBe('join');
        expect(expr.formatters.length).toBe(1);
        var res = expr.format({
            more: 1,
            other: true,
            name: 'Joe<b/>'
        }, {
            join:function() {
                return Array.prototype.join.call(arguments, ',');
            }
        });
        expect(res).toBe('hello Joe&lt;b/&gt;,huh,what 1');
    });


});