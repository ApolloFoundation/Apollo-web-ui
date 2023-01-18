import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from "qrcode.react";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../../helpers/forms/forms";
import {signBytesArrayAPL} from "../../../../../helpers/converters";
import ModalBody from "../../../../components/modals/modal-body";
import CustomTextArea from "../../../../components/form-components/TextArea/TextAreaWithFormik";
import CheckboxFormInput from "../../../../components/check-button-input/CheckboxWithFormik";
import InfoBox from '../../../../components/info-box';
import { getAccountPublicKeySelector } from '../../../../../selectors';
import CustomInput from '../../../../components/custom-input/CustomInputWithFormik';

export const SignTransactionForm = ({ setState, state, closeModal }) => {
  const dispatch = useDispatch();
  const publicKey = useSelector(getAccountPublicKeySelector);

  const  handleFormSubmit = async (values) => {
    if (!values.secretPhrase) {
        NotificationManager.error("Secret phrase is required", "Error", 5000);
        return;
    }
    setState(prevState => ({
        ...prevState,
        showSignature: false
    }));
    if (values.signJson) {
        const toSend = {
            unsignedTransactionJSON: values.signJson,
            validate: values.signValidate,
            publicKey,
            secretPhrase: values.secretPhrase,
            feeATM: 0,
            ecBlockHeight: 0
        };
        const res = await dispatch(submitForm.submitForm(toSend, "signTransaction"));
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, "Error", 5000)
        } else {
            NotificationManager.success("Transaction signed!", null, 5000);
        }
    } else if (values.signBytes) {
        const signature = signBytesArrayAPL(values.signBytes, values.secretPhrase);
        setState(prevState => ({
            ...prevState,
            showSignature: true,
            signedBytesSignature: signature,
        }));
    }
  };

  return (
    <ModalBody
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      isDisabe2FA
      isPour
      isDisableSecretPhrase
      submitButtonName='Sign Transaction'
    >
        <CustomTextArea
            label='Unsigned Transaction Bytes'
            name='signBytes'
            placeholder='Unsigned Transaction Bytes'
        />
        <CustomTextArea
            label='Unsigned Transaction JSON'
            name='signJson'
            placeholder='Unsigned Transaction JSON'
        />
        <CheckboxFormInput
            name='signValidate'
            label='Validate'
            id="signValidateCheckbox"
        />
        <div className="form-group mb-15">
            <CustomInput
                isPlain
                className='form-control'
                type="password"
                name="secretPhrase"
                placeholder="Secret Phrase"
                label="Secret phrase"
            />
        </div>
        {state.showSignature && (
            <>
                <div className="form-group mb-15">
                    <label>
                        Signature
                    </label>
                    <InfoBox info>
                        <div className="token word-brake">
                            {state.signedBytesSignature}
                        </div>
                    </InfoBox>
                </div>
                <div className='form-group mb-15'>
                    <label>Transaction Signature QR code</label>
                    <div>
                        <QRCode
                            value={state.signedBytesSignature}
                            size={100}
                        />
                    </div>
                </div>
            </>
        )}
    </ModalBody>
  );
}