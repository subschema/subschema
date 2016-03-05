"use strict";
import React, {Component} from 'react';
import expect from 'expect';
import {PropTypes, resolvers, ValueManager} from 'Subschema';
import  {intoWithContext, byComponent,findNode, change} from 'subschema-test-support';
import injectorFactory from 'subschema-injection/src/injectorFactory';
const injector = injectorFactory();
const {normalizeFieldsets} = resolvers.fieldset;

describe('resolvers/fieldset', function () {
    this.timeout(50000);
    const propTypes = {
        fieldsets: PropTypes.fieldset
    };

    injector.resolver(PropTypes.fieldset, resolvers.fieldset);

    it('should normalize fieldsets', function () {
        class TargetTest extends Component {
            static propTypes = propTypes;

            render() {
                return <span>hello</span>
            }
        }
        const Injected = injector.inject(TargetTest);
        const inst = intoWithContext(<Injected fieldsets={[{
        fields:'a,b',
        fieldsets:[{
            className:'stuff'
        },
        {
        fields:'c,d'
        }
        ]
        }]}/>, {}, true);

        const et = byComponent(inst, TargetTest);
        const node = findNode(et);
        expect(et.props.fieldsets.fields.length).toBe(2);

    });
    it('should normalize fieldsets deep', function () {
        class TargetTest extends Component {
            static propTypes = propTypes;

            render() {
                return <span>hello</span>
            }
        }
        const Injected = injector.inject(TargetTest);
        const inst = intoWithContext(<Injected fieldsets={[{
        fieldsets:[{
            className:'stuff',
        fields:'a,b',
        },
        {
        fields:'c,d'
        },
        {
        fieldsets:{
            fields:'e,f',
            className:'joe'
        }
        }
        ]
        }]}/>, {}, true);

        const et = byComponent(inst, TargetTest);
        const node = findNode(et);
        const fs = et.props.fieldsets;
        expect(fs.fields).toEqual('abcdef'.split(''));
        expect(fs.fieldsets[0].fieldsets[0].className).toBe('stuff');
    });
    //TODO - reenable.
    describe('should normalize fields and fieldsets', function () {
        it('should normilize fieldsets', function () {
            var inFieldsets = [{
                fields: ['a', 'b', 'c']
            }, {
                fields: ['d', 'e', 'f']
            }];
            var {fields}  = normalizeFieldsets(inFieldsets, null, {fieldsets: []}, context);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        });
        it('should normilize string fieldsets', function () {
            var inFieldsets = [{
                fields: 'a, b, c'
            }, 'd, e, f'
            ];
            var {fieldsets, fields}  = normalizeFieldsets(inFieldsets, null, {}, context);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            expect(fieldsets[0].fields).toEqual(['a', 'b', 'c']);
            expect(fieldsets[1].fields).toEqual(['d', 'e', 'f']);
        });

        it('should normalize nested fieldsets', function () {
            var inFieldsets = [{
                fieldsets: [
                    {fields: 'a'},
                    {fields: 'b'},
                    {fields: 'c'}]
            }, 'd, e, f'
            ];
            var {fieldsets, fields}  = normalizeFieldsets(inFieldsets, null, {}, context);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            expect(fieldsets[0].fieldsets[0].fields).toEqual(['a']);
            expect(fieldsets[0].fieldsets[1].fields).toEqual(['b']);
            expect(fieldsets[0].fieldsets[2].fields).toEqual(['c']);
        });
        it('should normalize nested fieldsets with fieldsets', function () {
            var inFieldsets = [{
                fieldsets: [
                    {fieldsets: [{fields: 'a'}]},
                    {fieldsets: [{fields: 'b'}]},
                    {fields: 'c'}]
            }, 'd, e, f'
            ];
            var {fieldsets, fields}  = normalizeFieldsets(inFieldsets, null, {}, context);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            expect(fieldsets[0].fieldsets[0].fieldsets[0].fields).toEqual(['a']);
            expect(fieldsets[0].fieldsets[1].fieldsets[0].fields).toEqual(['b']);
        });

    });
});