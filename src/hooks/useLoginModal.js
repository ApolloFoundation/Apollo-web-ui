import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { setModalType, setModalCallback, closeModal } from '../modules/modals';
import Button from '../containers/components/button';

export const useLoginModal = (onGeneratePDF) => {
  const dispatch = useDispatch();

  const handleLosePhraseError = () => {
    NotificationManager.error('You have to verify that you stored your private data.', 'Error', 7000); 
  }
  
  const handleModalActions = (onSubmit) => (isOk) => {
    isOk && onGeneratePDF();
    onSubmit();
    dispatch(closeModal());
  }

  const handleNextStep = (onSubmit, { losePhrase }) => () => {
    if (losePhrase) {
      dispatch(setModalType('SAVE_CREDENTIALS'));
      dispatch(setModalCallback(handleModalActions(onSubmit)));
    } else {
      handleLosePhraseError();
    }
  }

  const button = (handleSubmit, values) => (
    <Button
      name="Next"
      type="button"
      onClick={handleNextStep(handleSubmit, values)}
    />
  );

  return {
    loginModalButton: button,
  }
}