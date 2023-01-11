import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../../helpers/forms/forms";
import ModalBody from "../../../../components/modals/modal-body";
import CustomTextArea from "../../../../components/form-components/TextArea";
import { getAccountInfoSelector } from '../../../../../selectors';

export const BroadcastTransactionForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { publicKey } = useSelector(getAccountInfoSelector);

  const  handleFormSubmit = async (values) => {
    const toSendBroadcast = {
        transactionBytes: values.broadcastBytes,
        transactionJSON: values.broadcastJson,
        feeATM: 0,
        publicKey,
        ecBlockId: 11255812614937856744,
        ecBlockHeight: 0
    };
    const res = await dispatch(submitForm.submitForm(toSendBroadcast, "broadcastTransaction"));
    if (res.errorCode) {
        NotificationManager.error(res.errorDescription, "Error", 5000)
    } else {
        NotificationManager.success("Transaction broadcasted!", null, 5000);
    }
  };

  return (
    <ModalBody
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      isDisabe2FA
      isPour
      isDisableSecretPhrase
      submitButtonName='Broadcast'
    >
        <CustomTextArea
            label='Transaction Bytes'
            name='broadcastBytes'
            placeholder='Signed Transaction Bytes'
        />
        <CustomTextArea
            label='Signed Transaction JSON'
            name='broadcastJson'
            placeholder='Signed Transaction JSON'
        />
    </ModalBody>
  );
}