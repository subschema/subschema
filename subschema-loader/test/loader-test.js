import loaderFactory from '../src';
import expect from 'expect';


const a = () => {
}, b    = () => {
}, c    = () => {
}, d    = () => {
}, e    = () => {
}, A    = () => {
}, B    = () => {
};

describe('loadFactory', function () {

    it('should create a loader', function () {
        const loader = loaderFactory();
        expect(loader).toExist();
    });

    it('should create a loader of loaders', function () {
        const loader = loaderFactory();
        loader.addTemplate({ A });
        const loader2 = loaderFactory([loader]);

        loader.addTemplate('Be', B)
        expect(loader2.loadTemplate('Be')).toBe(B);
        expect(loader2.loadTemplate('A')).toBe(A);
    });

    it('should load resolvers', function () {

        const loader = loaderFactory([{
            resolvers: [a, b]
        }]);
        const r      = loader.loadResolver(a);
        expect(r).toBe(b);

        const loader2 = loaderFactory([loader]);
        loader2.addLoader({ resolvers: [[c, d]] });

        expect(loader2.loadResolver(a)).toBe(b);
        expect(loader2.loadResolver(c)).toBe(d);

        expect(loader2.loadResolver(e)).toNotExist();
        expect(loader.loadResolver(c)).toNotExist();
    });

    it('should load many resolvers', function () {
        const loader = loaderFactory([{
            resolvers: [[a, b], [c, d], [e, null]]
        }]);
        expect(loader.loadResolver(a)).toBe(b);
        expect(loader.loadResolver(c)).toBe(d);
        expect(loader.loadResolver(e)).toBe(null);

    });
    it('should load mixed', function () {

        const loader = loaderFactory([{
            resolvers: [a, b]
        }]);

        const loader2 = loaderFactory([{ resolvers: [[c, d]] }, loader]);

        expect(loader2.loadResolver(a)).toBe(b);
        expect(loader2.loadResolver(a)).toBe(b);
        expect(loader2.loadResolver(c)).toBe(d);

        expect(loader2.loadResolver(e)).toNotExist();
        expect(loader.loadResolver(c)).toNotExist();
    });
    it('should load list key val', function () {

        const loader = loaderFactory();
        loader.addResolver(a, b);

        const loader2 = loaderFactory([{ resolvers: [[c, d]] }, loader]);
        expect(loader2.listResolvers().map(v => v.name)).toEqual([c, a]);

        loader2.removeResolver(a);
        expect(loader2.listResolvers().map(v => v.name)).toEqual([c]);
    });
    it('should load list array val', function () {

        const loader = loaderFactory();
        loader.addResolver([a, b]);

        const loader2 = loaderFactory([{ resolvers: [[c, d]] }, loader]);
        expect(loader2.listResolvers().map(v => v.name)).toEqual([c, a]);

        loader2.removeResolver(a);
        expect(loader2.listResolvers().map(v => v.name)).toEqual([c]);
    });
    it('should load list nested array val', function () {
        const loader = loaderFactory();
        loader.addResolver([[a, b]]);
        expect(loader.loadResolver(a)).toBe(b);
    });

    it('should resolve object', function () {

        const loader = loaderFactory([{
            types   : {
                A
            },
            template: {
                B
            }

        }]);
        expect(loader.loadType("A")).toBe(A);
        expect(loader.loadTemplate("B")).toBe(B);

    });
    it('should resolve map', function () {

        const loader = loaderFactory([{
            types: new Map([['A', A], ['B', B]])
        }]);
        expect(loader.loadType("A")).toBe(A);
        expect(loader.loadType("B")).toBe(B);

    });
    it('should override value', function () {

        const loader = loaderFactory([{
            types: new Map([['A', 1]])
        }]);
        loader.addType('A', 2);
        loader.addLoader(loaderFactory([{
            types: {
                A: 3
            }
        }]));
        expect(loader.loadType("A")).toBe(3);
    });
    it('should map maps', function () {

        const loader    = loaderFactory();
        const propTypes = {
            a,
            b
        };
        const resolvers = {
            a: c,
            b: e
        };
        loader.addResolvers(propTypes, resolvers);
        expect(loader.loadResolver(a)).toBe(c);
        expect(loader.loadResolver(b)).toBe(e);

    });

});
