import React from 'react';
import { useDispatch } from 'react-redux';
import { setModalType, closeModal } from '../modules/modals';
import Button from '../containers/components/button';

export const useLoginModal = (onGeneratePDF) => {
  const dispatch = useDispatch();

  const handleModalActions = (onSubmit) => (isOk) => {
    isOk && onGeneratePDF();
    onSubmit();
    // dispatch(closeModal());
  }

  const handleNextStep = (onSubmit, { losePhrase }) => () => {
      dispatch(setModalType('SAVE_CREDENTIALS'));
      handleModalActions(onSubmit)(true);
  }

  const button = (handleSubmit, values) => (
    <Button
      className="btn-without"
      name="Create account and get account info"
      type="button"
      onClick={handleNextStep(handleSubmit, values)}
    />
  );

  return {
    loginModalButton: button,
  }
}