
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { validateTokenAction } from "actions/account";
import ModalBody from 'containers/components/modals/modal-body';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';

export const ValidateToken = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);

  const handleValidateToken = useCallback(async (values) => {
    setIsPending(true);
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
    setIsPending(false);
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
        isPending={isPending}
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