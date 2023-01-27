import React from 'react';
import { useDispatch } from "react-redux";
import {NotificationManager} from "react-notifications";
import submitForm from "helpers/forms/forms";
import ModalBody from "containers/components/modals/modal-body";
import CustomTextArea from "containers/components/form-components/TextArea/TextAreaWithFormik";
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';

export const FullHashForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const handleFormSubmit = async (values) => {
    const toSendCalculate = {
      unsignedTransactionBytes: values.calculateBytes,
      unsignedTransactionJSON: values.calculateJson,
      signatureHash: values.calculateHash,
      feeATM: 0,
      random: Math.random()
    };
    const res = await dispatch(submitForm.submitForm(toSendCalculate, "calculateFullHash"));
    if (res.errorCode) {
        NotificationManager.error(res.errorDescription, "Error", 5000)
    } else {
        NotificationManager.success("Hash calculated", null, 5000);
    }
  }

  return (
    <ModalBody
        closeModal={closeModal}
        handleFormSubmit={handleFormSubmit}
        isDisabe2FA
        isPour
        isDisableSecretPhrase
        submitButtonName='Calculate Full Hash'
    >
        <CustomTextArea
            label='Unsigned Transaction Bytes'
            name='calculateBytes'
            placeholder='Unsigned Transaction Bytes'
        />
        <CustomTextArea
            label='Unsigned Transaction JSON'
            name='calculateJson'
            placeholder='Unsigned Transaction JSON'
        />
        <CustomInput
            label='Signature Hash'
            name="calculateHash"
            placeholder="Signature Hash"
            type="text"
        />
    </ModalBody>
  );
}
