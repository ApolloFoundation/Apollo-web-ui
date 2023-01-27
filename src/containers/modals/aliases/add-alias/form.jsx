import React from 'react';
import CustomInput from '../../../components/custom-input/CustomInputWithFormik';
import CustomSelect from '../../../components/form-components/CustomSelect';
import { AliasFields } from 'containers/components/form-components/AliasFields';

const AddAliasForm = ({ aliasTypeData }) => (
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
        <AliasFields />
    </>
);

export default AddAliasForm;