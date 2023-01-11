import React from 'react';
import { useFormikContext } from 'formik';
import AccountRSFormInput from '../../../components/form-components/AccountRS';
import CustomInput from '../../../components/custom-input/CustomInputWithFormik';
import CustomSelect from '../../../components/form-components/CustomSelect';

const AddAliasForm = ({ aliasTypeData }) => {
    const { values } = useFormikContext();

    return (
        <>
            <CustomSelect
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