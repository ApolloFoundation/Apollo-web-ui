import React from 'react';
import CustomFormSelect from 'containers/components/form-components/CustomSelect';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import { AliasFields } from 'containers/components/form-components/AliasFields';

const EditAliasForm = ({ alias, typeData }) =>  (
    <>
        <CustomFormSelect
            options={typeData}
            label='Type'
            name='type'
        />
        <TextualInputComponent 
            label='Alias'
            text={alias ? alias?.aliasName : ''}
        />
        <AliasFields alias={alias}  />
    </>
)

export default EditAliasForm;