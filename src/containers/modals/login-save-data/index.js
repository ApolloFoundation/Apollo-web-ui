/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
******************************************************************************/


import React from 'react';
import { useSelector } from 'react-redux';
import Button from 'containers/components/button';
import { PureModal } from 'containers/components/modals/pure-modal/pure-modal';


export const LoginSaveData = () => {

  const modalCallback = useSelector(state => state.modals.modalCallback);

  const handleSuccess = () => modalCallback(true);
  const handleUnwant = () => modalCallback(false);

  return (
    <PureModal>
      <div className="d-flex justify-content-center">
        <h3>Do you want to download account information?</h3>
      </div>
      <div className="d-flex justify-content-around mt-5">
        <Button onClick={handleSuccess} name='yes' />
        <Button onClick={handleUnwant} name='no' />
      </div>
    </PureModal>
  );
}