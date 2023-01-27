import React from 'react';
import { useDispatch } from 'react-redux';
import { setModalType } from 'modules/modals';
import Button from 'containers/components/button';

export const useLoginModal = (onGeneratePDF) => {
  const dispatch = useDispatch();

  const handleModalActions = (onSubmit) => {
    onGeneratePDF();
    onSubmit();
  }

  const handleNextStep = (onSubmit) => () => {
      dispatch(setModalType('SAVE_CREDENTIALS'));
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