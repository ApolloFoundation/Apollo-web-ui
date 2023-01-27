import React from 'react';
import { useDispatch } from "react-redux"
import { setModalType } from 'modules/modals';
import Button from 'containers/components/button';

export const PrivateTransactionButton = ({ isPrivate }) => {
  const dispatch = useDispatch();

  const handleOpenModal = () => dispatch(setModalType('PrivateTransactions'));

  return (
    <Button
      size="sm"
      color="green"
      disabled={isPrivate}
      onClick={handleOpenModal}
      name="Show private transactions"
    />
  )
}