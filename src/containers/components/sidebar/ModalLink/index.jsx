import React from 'react';
import { useDispatch } from 'react-redux';
import {setModalType} from 'modules/modals';

export const ModalLink = ({ modalType, label, }) => {
  const dispatch = useDispatch();

  const handleClick = () => dispatch(setModalType(modalType));

  return (
    <span className='text' onClick={handleClick}>
      {label}
      <i className="zmdi zmdi-case left" />
    </span>
  );
};