import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openPrevModal } from '../../../modules/modals';
import { getModalHistorySelector } from '../../../selectors';

export const ModalBackButton = () => {
  const dispatch = useDispatch();
  const modalsHistory = useSelector(getModalHistorySelector);

  const handleOpenPrevModal = () => dispatch(openPrevModal());

  if (modalsHistory.length === 1) return null;

  return <div className="backMy" onClick={handleOpenPrevModal} />
}