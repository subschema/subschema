import {decorators} from 'Subschema';
import expect from 'expect';

var decorator = decorators.decorator;
var originalWarning = decorator.warning;
describe.only('decorator', function () {
	beforeEach(function () {
		decorator.warning = originalWarning;
	})
	it('should be able to detect a class decorator with a function', function () {
		var warning;
		decorator.warning = function (check, message) {
			warning = message;
		}
		var newdecorator = decorator(function test(...help) {
			console.log('help', help);

			return function (...args) {
				console.log('args', args);
			}
		});

		var a = function () {

		}
		@newdecorator(a)
		class Stuff {

		}
		var me = new Stuff();
		expect(warning).toExist();


	});
	it('should be able to detect a property decorator on a class', function () {
		var warning;
		decorator.warning = function (check, message) {
			warning = message;
		}
		var newdecorator = decorator(function test(...help) {
			console.log('help', help);

			return function (...args) {
				console.log('args', args);
			}
		});

		var a = function () {

		}
		@newdecorator(a)
		class Stuff {

		}
		var me = new Stuff();
		expect(warning).toExist();


	});
	it('should be able to detect a class decorator on a property', function () {
		var warning;
		decorator.warning = function (check, message) {
			warning = message;
		}
		var newdecorator = decorator(null, function test(...help) {
			console.log('help', help);

			return function (...args) {
				console.log('args', args);
			}
		});

		var a = function () {

		}

		class Stuff {
			@newdecorator
			notright() {

			}

		}
		var me = new Stuff();
		expect(warning).toExist();
	});

	it('should be create property decorator', function () {
		var warning, parameters, invokers;
		decorator.warning = function (check, message) {
			warning = message;
		}
		var newdecorator = decorator.property(function test(...help) {
			parameters = help;

			return function (...args) {
				invokers = args;
				return args[2];
			}
		});

		var a = function () {

		}

		class Stuff {
			@newdecorator
			notright() {

			}

		}
		var me = new Stuff();
		expect(warning).toNotExist();
		expect(invokers).toExist();
		expect(parameters).toExist();
	});

	it('should be create clazz decorator', function () {
		var warning, parameters, invokers;
		decorator.warning = function (check, message) {
			warning = message;
		}
		var newdecorator = decorator.clazz(function test(...help) {
			parameters = help;

			return function (...args) {
				invokers = args;
				return args[2];
			}
		});

		var a = function () {

		}
		@newdecorator
		class Stuff {

			notright() {

			}

		}
		var me = new Stuff();
		expect(warning).toNotExist();
		expect(invokers).toExist();
		expect(parameters).toExist();
	});
	it('should be create clazz decorator and property decorator', function () {
		var warning, propertyArgs, propertyDescriptor, classArgs, classDescriptor;
		decorator.warning = function (check, message) {
			warning = message;
		}
		var newdecorator = decorator(function testProperty(other) {
			propertyArgs = other;
			return function (target, name, descriptor) {
				propertyDescriptor = [target,name,descriptor];
				return descriptor;
			}
		}, function testClass(help) {
			classArgs = help;
			return function (target) {
				classDescriptor = target;
				return target;
			}
		});

		var a = function () {

		}
		@newdecorator('a')
		class Stuff {
			@newdecorator('b')
			right() {
				return 1;
			}
		}

		var me = new Stuff();
		expect(warning).toNotExist();
		
		expect(propertyArgs).toBe('b');
		expect(propertyDescriptor).toExist();
		
		expect(classArgs).toBe('a');
		expect(classDescriptor).toBe(Stuff);
		expect(me.right()).toBe(1);
		
	});

});