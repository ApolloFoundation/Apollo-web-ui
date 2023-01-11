import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import CustomFormSelect from '../../../components/form-components/CustomSelect';
import TextualInputComponent from '../../../components/form-components/TextualInput';
import AccountRSFormInput from '../../../components/form-components/AccountRS';

const EditAliasForm = ({ alias, typeData }) => {
    const { values, setFieldValue } = useFormikContext();
    
    useEffect(() => {
        setFieldValue('aliasURI', alias?.aliasName);
    }, [alias?.aliasName, setFieldValue]);
    
    return (
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
            {
                values.type === 'uri' &&
                <TextualInputComponent 
                    label='URI'
                    name="aliasURI"
                    placeholder="http://"
                    type="text"
                />
            }
            {
                values.type ==='account' &&
                <AccountRSFormInput name='aliasURI' label='Account ID' />
            }
            {
                values.type  === 'general' &&
                <TextualInputComponent 
                    label='Data'
                    name="aliasURI"
                    placeholder="Data"
                    type="text"
                />
            }
        </>
    )
}

export default EditAliasForm;