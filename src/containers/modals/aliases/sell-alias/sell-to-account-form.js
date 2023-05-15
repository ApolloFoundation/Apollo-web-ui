import React from 'react';


import CustomFormSelect from '../../../components/form-components/custom-form-select';
import TextualInputComponent from '../../../components/form-components/textual-input';
import AccountRSFormInput from '../../../components/form-components/account-rs';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import CustomTextArea from '../../../components/form-components/text-area';



const SellToAccountForm = (props) => {

    const {alias, setValue, getFormState, idGroup, ticker} = props;
    const {values: {add_message, recipient}} = getFormState();

    return (
        <>
            {
                alias &&
                <TextualInputComponent
                    label={'Alias'}
                    text={alias.aliasName}
                />
            }


            <AccountRSFormInput
                field={'recipient'}
                label={'Recipient'}
                defaultValue={alias ? alias.accountRS : ''}
                value={recipient}
                setValue={setValue}
            />
            <NumericInputComponent
                label={'Price'}
                field={'priceATM'}
                placeholder={'Price'}
                countingTtile={ticker}
                setValue={setValue}
                idGroup={idGroup}
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

export default SellToAccountForm;
