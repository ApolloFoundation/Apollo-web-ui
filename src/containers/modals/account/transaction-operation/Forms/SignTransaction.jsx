import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from "qrcode.react";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../../helpers/forms/forms";
import {signBytesArrayAPL} from "../../../../../helpers/converters";
import ModalBody from "../../../../components/modals/modal-body";
import CustomTextArea from "../../../../components/form-components/text-area";
import {CheckboxFormInput} from "../../../../components/form-components/check-button-input";
import InputForm from "../../../../components/input-form";
import InfoBox from '../../../../components/info-box';
import { getAccountInfoSelector } from '../../../../../selectors';

export const SignTransactionForm = ({ setState, state, closeModal }) => {
  const dispatch = useDispatch();
  const { publicKey } = useSelector(getAccountInfoSelector);

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
            field='signBytes'
            placeholder='Unsigned Transaction Bytes'
        />
        <CustomTextArea
            label='Unsigned Transaction JSON'
            field='signJson'
            placeholder='Unsigned Transaction JSON'
        />
        <CheckboxFormInput
            checkboxes={[
                {
                    field: 'signValidate',
                    label: 'Validate',
                }
            ]}
        />
        <div className="form-group mb-15">
            <label>
                Secret phrase
            </label>
            <div>
                <InputForm
                    isPlain
                    className='form-control'
                    type="password"
                    field="secretPhrase"
                    placeholder="Secret Phrase"
                />
            </div>
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