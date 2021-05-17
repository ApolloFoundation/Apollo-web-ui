import React from 'react';
import './index.scss';

export const PureModal = ({ children }) => {
  return (
    <div className="modal-box pure-modal">
      {children}
    </div>
  );
}