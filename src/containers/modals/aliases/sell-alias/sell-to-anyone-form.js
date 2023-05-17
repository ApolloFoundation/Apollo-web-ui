import React from 'react';


import CustomFormSelect from '../../../components/form-components/custom-form-select';
import TextualInputComponent from '../../../components/form-components/textual-input';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import CustomTextArea from '../../../components/form-components/text-area';



const SellToAllForm = (props) => {

    const {alias, setValue, getFormState} = props;
    const {values: {add_message}} = getFormState();
    
    return (
        <>
            {
                alias && 
                <TextualInputComponent
                    label={'Alias'}
                    text={alias.aliasName}
                />
            }

            <NumericInputComponent
                label={'Price'}
                field={'priceATM'}
                placeholder={'Price'}
                setValue={setValue}
            />
            <CheckboxFormInput
                setValue={setValue}
                checkboxex={[
                    {
                        field: 'add_message',
                        label: 'Add a message?'
                    }
                ]}
            />
            {
                add_message && 
                <>
                    <CustomTextArea
                        setValue={setValue}
                        label={'Message'}
                        field={'message'}
                        placeholder={'Message'}
                    />
                    <CheckboxFormInput
                        setValue={setValue}
            
                        label={''}
                        checkboxes={[
                            {
                                label: 'Encrypt Message',
                                field: 'encrypt_message',
                                defaultValue: true
                            },{
                                label: 'Message is Never Deleted',
                                field: 'permanent_message',
                            },
                        ]}
                    />
                </>
            }
            
        </>
    )
}

export default SellToAllForm;