import React from 'react';


import CustomFormSelect from '../../../components/form-components/custom-form-select';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import TextualInputComponent from '../../../components/form-components/textual-input';
import AccountRSFormInput from '../../../components/form-components/account-rs';

const typeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

class CancelSaleForm extends React.Component {
    state = {inputType: 'uri'};

    handleChange = (value) => {
        this.setState({
            inputType: value
        })
    };

    render () {
        const {setValue, values} = this.props;
        
        return (
            <>
                <CustomFormSelect
                    defaultValue={typeData[0]}
                    setValue={setValue}
                    options={typeData}
                    label={'Type'}
                    field={'type'}
                    onChange={this.handleChange}
                />
                <TextualInputComponent 
                    label={'Alias'}
                    text={this.state.alias.aliasName}
                />
                {
                    this.state.inputType === 'uri' &&
                    <TextualInputComponent 
                        label={'URI'}
                        field="aliasURI"
                        placeholder="http://"
                        type={"text"}
                        setValue={setValue}
                    />
                }
                {
                    this.state.inputType === 'account' &&
                    <AccountRSFormInput
                        field={'aliasURI'}
                        label={'Account ID'}
                        setValue={setValue}
                        defaultValue={values.aliasURI || ''}
                        value={values.aliasURI}
                    />
                }
                {
                    this.state.inputType === 'general' &&
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

export default CancelSaleForm;