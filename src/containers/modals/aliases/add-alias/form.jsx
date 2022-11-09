import React from 'react';
import { useFormikContext } from 'formik';
import AccountRSFormInput from '../../../components/form-components/account-rs1';
import CustomInput from '../../../components/custom-input';
import CustomSelect from '../../../components/form-components/custom-form-select1';

const aliasTypeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

const AddAliasForm = () => {
    const { values } = useFormikContext();

    return (
        <>
            <CustomSelect
                defaultValue={aliasTypeData[0]}
                options={aliasTypeData}
                label='Type'
                name='type'
            />
            <CustomInput
                label='Alias'
                name='aliasName'
                placeholder='Alias name'
            />
            {
                values.type === 'uri' &&
                <CustomInput 
                    label='URI'
                    name="aliasURI"
                    placeholder="http://"
                    type="text"
                />
            }
            {
                values.type === 'account' &&
                <AccountRSFormInput
                    name='aliasURI'
                    label='Account ID'
                />
            }
            {
                values.type === 'general' &&
                <CustomInput 
                    label='Data'
                    name="aliasURI"
                    placeholder="Data"
                    type="text"
                />
            }
        </>
    );
}

export default AddAliasForm;