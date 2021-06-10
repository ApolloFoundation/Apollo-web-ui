import React from 'react';
import { setModalType } from '../modules/modals';
import Button from '../containers/components/button';
import store from '../store';

export const useLoginModal = (onGeneratePDF) => {
  
  const handleModalActions = (onSubmit) => {
    onGeneratePDF();
    onSubmit();
  }

  const handleNextStep = (onSubmit) => () => {
      store.dispatch(setModalType('SAVE_CREDENTIALS'));
      handleModalActions(onSubmit);
  }

  const button = (handleSubmit) => (
    <Button
      className="btn-without"
      name="Create account and get account info"
      type="button"
      onClick={handleNextStep(handleSubmit)}
    />
  );

  return {
    loginModalButton: button,
  }
}