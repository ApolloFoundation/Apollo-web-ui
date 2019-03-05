import React from 'react';
import {connect} from 'react-redux';

import AccountRSFormInput from '../../../components/form-components/account-rs'
import CustomTextArea from '../../../components/form-components/text-area'
import {CheckboxFormInput} from '../../../components/form-components/check-button-input';

const ComposeMessageForm = ({setVaue, getValue, modalData, getFormState}) => (
    <>
        <AccountRSFormInput
            setVaue={setVaue}
            label={'Recipient'}
            field={'recipient'}
            value={getValue('recipient') || ''}
            defaultValue={(modalData && modalData.recipient) ? modalData.recipient : ''}
        />
        <CustomTextArea
            setVaue={setVaue}
            label={'Message'}
            field={'message'}
            placeholder={'Message'}
        />
        <CheckboxFormInput
            setVaue={setVaue}
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