import expect from 'expect';
import expression from '../lib';
import loscape from 'lodash/escape';

describe('expression/Readme', function () {

    it('should exec example 1', function () {

        var exprObj = expression('hello {world}');

        var str = exprObj.format({
            world: 'Joe'
        });

        expect(str).toBe('hello Joe');
    });
    it('should exec example 2', function () {
        var exprObj = expression('hello {comma(you, "me")} and {uppercase(world)}');

        var str = exprObj.format({
            world: 'Joe',
            you: 'Bob'
        }, {
            uppercase:function(f){
                return f == null ? '' : f.toUpperCase()
            },
            comma:function(){
                return Array.prototype.join.call(arguments,', ');
            }
        });

        expect(str).toBe('hello Bob, me and JOE');
    });

    it('should exec example 3', function () {

        var exprObj = expression('hello {uppercase(name.first)} and {name.last}');

        var str = exprObj.format({
            name: {
                first: 'Joe',
                last: 'Bob'
            }
        }, {
            uppercase:function(f){
                return f == null ? '' : f.toUpperCase()
            }
        });
        //str is hello JOE and Bob
        expect(str).toBe('hello JOE and Bob');
    });

    it('should exec example 4', function () {


        var exprObj = expression('hello {uppercase(name.first)} and {name.last}');
        var formatters = {
            uppercase(f){
                return f == null ? '' : f.toUpperCase()
            }
        };
        var str = exprObj.format({
            name: {
                first: 'Joe',
                last: 'Bob'
            }
        }, formatters);

        //str is hello JOE and Bob
        expect(str).toBe('hello JOE and Bob')
        str = exprObj.format({
            name: {
                first: 'Billy',
                last: 'Joe'
            }
        }, formatters);

        //str is hello BILLY and Joe
        expect(str).toBe('hello BILLY and Joe')
    });
    it('should exec example 5', function () {



        var exprObj = expression('hello {h1(name.first)}');
        var formatters = {
            h1(f){
                return `--<h1>${f == null ? '' : loscape(f.toUpperCase())}</h1>--`;
            }
        };
        var str = exprObj.format({
            name: {
                first: 'Joe<b/>',
                last: 'Bob'
            }
        }, formatters);
        //str is hello <h1>JOE</h1>
        expect(str).toBe('hello <h1>JOE&lt;B/&gt;</h1>');
    })
});