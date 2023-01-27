import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {NotificationManager} from "react-notifications";
import ModalBody from "containers/components/modals/modal-body";
import CustomTextArea from "containers/components/form-components/TextArea/TextAreaWithFormik";
import { getAccountPublicKeySelector } from 'selectors';

export const BroadcastTransactionForm = ({ closeModal, processForm }) => {
  const publicKey = useSelector(getAccountPublicKeySelector);

  const  handleFormSubmit = useCallback(async (values) => {
    const toSendBroadcast = {
        transactionBytes: values.broadcastBytes,
        transactionJSON: values.broadcastJson,
        feeATM: 0,
        publicKey,
        ecBlockId: 11255812614937856744,
        ecBlockHeight: 0
    };
    const res = await processForm(toSendBroadcast, "broadcastTransaction");
    if (!res.errorCode) {
      NotificationManager.success("Transaction broadcasted!", null, 5000);
    }
  }, [processForm]);

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