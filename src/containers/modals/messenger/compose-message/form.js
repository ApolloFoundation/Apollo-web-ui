import React from 'react';
import {connect} from 'react-redux';

import AccountRSFormInput from '../../../components/form-components/account-rs'
import CustomTextArea from '../../../components/form-components/text-area'
import {CheckboxFormInput} from '../../../components/form-components/check-button-input';

const ComposeMessageForm = ({setValue, getValue, modalData, getFormState, values}) => (
    <>
        <AccountRSFormInput
            setValue={setValue}
            label={'Recipient'}
            field={'recipient'}
            value={getValue('recipient') || ''}
            defaultValue={(modalData && modalData.recipient) ? modalData.recipient : ''}
        />
        <CustomTextArea
            setVaue={setValue}
            label={'Message'}
            field={'message'}
            placeholder={'Message'}
        />
        <CheckboxFormInput
            setVaue={setValue}
            checkboxes={[
                {
                    field: 'messageToEncrypt',
                    label: 'Encrypt Message',
                    defaultValue: true
                }
            ]}
        />
    </>
)

const mapStateToProps = state => ({
    modalData: state.modals.modalData
})

export default connect(mapStateToProps)(ComposeMessageForm);