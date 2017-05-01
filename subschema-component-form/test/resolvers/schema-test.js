import expect from 'expect';
import {normalizeSchema} from 'subschema-core/lib/resolvers/schema';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';

describe('resolvers/schema', function () {


    it('should normalize with subSchema with loaders', function () {
        const {context} = newSubschemaContext();
        context.loader.addSchema({
            Address: {
                schema: {
                    address: 'Text',
                    city: 'Text',
                    state: {
                        type: 'Select',
                        options: ['CA', 'FL', 'VA', 'IL']
                    },
                    zipCode: {
                        type: 'Text',
                        dataType: 'number'
                    }
                },
                fields: ['address', 'city', 'state', 'zipCode']
            },
            Contact: {
                schema: {
                    name: 'Text',
                    primary: {
                        type: 'ToggleObject',
                        subSchema: 'Address',
                        template: 'SimpleTemplate'
                    },
                    otherAddresses: {
                        canEdit: true,
                        canReorder: true,
                        canDelete: true,
                        canAdd: true,
                        type: 'List',
                        labelKey: 'address',
                        itemType: {
                            type: 'Object',
                            subSchema: 'Address'
                        }
                    }
                },
                fields: ['name', 'primary', 'otherAddresses']
            }
        });
        var result = normalizeSchema({subSchema: 'Contact'}, null, {}, context);
        expect(result.fields, 'name', 'primary', 'otherAddresss');
    });

});
