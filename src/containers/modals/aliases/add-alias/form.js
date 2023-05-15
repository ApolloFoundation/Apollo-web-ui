import React from 'react';

import CustomFormSelect from '../../../components/form-components/custom-form-select';
import TextualInputComponent from '../../../components/form-components/textual-input';
import AccountRSFormInput from '../../../components/form-components/account-rs';

const aliasTypeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

class AddAliasForm extends React.Component {
    state = {};
    
    render () {
        const {setValue, values} = this.props;

        return (
            <>
                <CustomFormSelect
                    defaultValue={aliasTypeData[0]}
                    setValue={setValue}
                    options={aliasTypeData}
                    label={'Type'}
                    field={'type'}
                    onChange={this.handleChange}
                />
        
                <TextualInputComponent
                    setValue={setValue}
                    label={'Alias'}
                    field={'aliasName'}
                    placeholder={'Alias name'}
                />
              
                {
                    values.type === 'uri' &&
                    <TextualInputComponent 
                        label={'URI'}
                        field="aliasURI"
                        placeholder="http://"
                        type={"text"}
                        setValue={setValue}
                    />
                }
                {
                    values.type === 'account' &&
                    <AccountRSFormInput
                        field={'aliasURI'}
                        label={'Account ID'}
                        setValue={setValue}
                        defaultValue={values.aliasURI || ''}
                        value={values.aliasURI}
                    />
                }
                {
                    values.type === 'general' &&
                    <TextualInputComponent 
                        label={'Data'}
                        field="aliasURI"
                        placeholder="Data"
                        type={"text"}
                        setValue={setValue}
                    />
                }
            </>
        )
    }
}

export default AddAliasForm;