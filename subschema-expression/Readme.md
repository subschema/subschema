Subschema Expression
===
Subschema expression allows for expressions to be used within Subschema.
It used by Content and the expression resolver to take a string look up
the substitutable values in the value manager and return a string.

It is meant to trust the formatting string, but not the input (i.e. value
manager);  So to prevent script injection all evaluated output is escaped.
However the string format is not.  So you can output html in the format
but not in the values.

## Installation
```sh
$ npm install subschema-expression
```

### Usage

The import takes a string and parses to an expression object
that looks like
{
  format(dataObject, formatterObject),
  listen:['array of substituted values'],
  formatters:['array of formatter names']
}

The format function on the expression object can be called
multiple times.   The listen array, has a list of variables
to be substituted with the correspoinding keys in the
dataObject



```es6
    import expression from 'subschema-expression';

    const exprObj = expression('hello {world}');

    const str = exprObj.format({
       world: 'Joe'
    });

    //str is 'hello Joe';

```

### Usage with formatters.

You can also use expression strings with functions.  If
the argument to the function is quoted '' or ""
it is passed as a literal. If it is not quoted it is resolved against
the object that is passed to format.


```es6
     import expression from 'subschema-expression';

     const exprObj = expression('hello {comma(you, "me")} and {uppercase(world)}');

          const str = exprObj.format({
              world: 'Joe',
              you: 'Bob'
          }, {
              uppercase(f){
                  return f == null ? '' : f.toUpperCase()
              },
              comma(...args){
                  return args.join(', ');
              }
          });

       //str is now 'hello Bob, me and JOE'

```

### Nested Paths
You can use nested paths following the convention used by lodash get. Basically
using '.' to descend objects.

```es6
        import expression from 'subschema-expression';

        const exprObj = expression('hello {uppercase(name.first)} and {name.last}');

        const str = exprObj.format({
            name: {
                first: 'Joe',
                last: 'Bob'
            }
        }, {
            uppercase(f){
                return f == null ? '' : f.toUpperCase()
            }
        });
        //str is hello JOE and Bob
```

### Reusing Expressions.
An expression once compiled is reusable.

```es6
        import expression from 'subschema-expression';

        const exprObj = expression('hello {uppercase(name.first)} and {name.last}');
        const formatters = {
            uppercase(f){
                return f == null ? '' : f.toUpperCase()
            }
        };
        let str = exprObj.format({
            name: {
                first: 'Joe',
                last: 'Bob'
            }
        }, formatters);

        //str is hello JOE and Bob
        str = exprObj.format({
            name: {
                first: 'Billy',
                last: 'Joe'
            }
        }, formatters);

        //str is hello BILLY and Joe

```


### Dangerous Expressions.
You may want a formatter to return html.  Well I can't stop you, but
if you do, you can return a string wrapped with '--' and it will not escape
its output.   Its up to you to sanitize the input in this case. Please use
caution.

```es6
        import expression from 'subschema-expression';
        import loscape from 'lodash/string/escape';

        const exprObj = expression('hello {h1(name.first)}');
        const formatters = {
            h1(f){
                return `--<h1>${f == null ? '' : loscape(f.toUpperCase())}</h1>--`;
            }
        };
        let str = exprObj.format({
            name: {
                first: 'Joe<B/>',
                last: 'Bob'
            }
        }, formatters);
        //str is hello<h1>JOE&lt;B/&gt;</h1>

```

### Running Karma
So sometimes its nice to run karma for debugging.  To do so
you will need to change test/*-test.js from
```js
  var expression = require('../dist/expression');
```
to

```js
   var expression = require('subschema-expression');
```

```sh
$ npm run karma
```