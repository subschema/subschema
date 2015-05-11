var formatter = require('../src/formatter');

var expect = require('expect');
describe('should create a formatter from a a pattern', function () {

    describe('###-##-#### ', function () {
        it('should ###-##-#### parse nicely', function () {


            var pattern = formatter('###-##-####'), result;


            result = pattern('12345');
            expect(result.value).toBe('123-45-');
            expect(result.isValid).toBe(false);

            result = pattern('123456789');
            expect(result.isValid).toBe(true);
            expect(result.value).toBe('123-45-6789');


            result = pattern('123-45-6789');

            expect(result.isValid).toBe(true);
            expect(result.value).toBe('123-45-6789');


        });
        it('should ###-##-#### parse nicely and not add the last delimeter when backwards is on', function () {


            var pattern = formatter('###-##-####'), result;


            result = pattern('12345', true);
            expect(result.value).toBe('123-45');
            expect(result.isValid).toBe(false);

            /*
             result = pattern('123456789');
             expect(result.isValid).toBe(true);
             expect(result.value).toBe('123-45-6789');


             result = pattern('123-45-6789');

             expect(result.isValid).toBe(true);
             expect(result.value).toBe('123-45-6789');
             */
        })


    });
})