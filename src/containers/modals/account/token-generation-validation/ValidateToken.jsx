
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { validateTokenAction } from "../../../../actions/account";
import ModalBody from '../../../components/modals/modal-body';
import CustomTextArea from '../../../components/form-components/text-area1';
import CustomInput from '../../../components/custom-input';

export const ValidateToken = ({ closeModal }) => {
  const dispatch = useDispatch();

  const handleValidateToken = useCallback(async (values) => {
    const validateToken = await dispatch(validateTokenAction({
        token: values.token,
        website: values.website
    }));

    if (validateToken) {
        if (validateToken.valid) {
            NotificationManager.success('Token is valid!')
        } else {
            NotificationManager.error('Token is invalid!')
        }
    }
  },[dispatch])

  return (
    <ModalBody
        closeModal={closeModal}
        handleFormSubmit={handleValidateToken}
        className='p-0 transparent gray-form'
        isDisabe2FA
        isPour
        isDisableSecretPhrase
        submitButtonName='Validate'
    >
        <CustomTextArea
            label='Data'
            name='website'
            placeholder='Website or text'
        />
        <CustomInput
            label='Token'
            name="token"
            placeholder="Token"
            type="text"
        />
    </ModalBody>
  );
}