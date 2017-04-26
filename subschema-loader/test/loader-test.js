import loaderFactory from '../src/index';
import expect from 'expect';
function A() {
}

function B() {
}

describe('loadFactory', function () {

    it('should create a loader', function () {
        const loader = loaderFactory();
        expect(loader).toExist();
    });

    it('should create a loader of loaders', function () {
        const loader = loaderFactory();
        loader.addTemplate({A});
        const loader2 = loaderFactory([loader]);

        loader.addTemplate('Be', B)
        expect(loader2.loadTemplate('Be')).toBe(B);
        expect(loader2.loadTemplate('A')).toBe(A);
    })

});