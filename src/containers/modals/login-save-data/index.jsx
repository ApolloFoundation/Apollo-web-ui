/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
******************************************************************************/


import React from 'react';
import Button from 'containers/components/button';
import { PureModal } from 'containers/components/modals/pure-modal/pure-modal';
import styles from './index.module.scss';

export const LoginSaveData = ({ closeModal }) => {
  return (
    <PureModal withCloseButton>
      <div className="d-flex justify-content-center">
        <h3 className={styles.loginSaveDataTitle}>You download account information in a pdf file</h3>
      </div>
      <p className={styles.loginSaveDataText}>
        This PDF file contains all the information about your accounts. Also QR codes of your wallet.
      </p>
      <div className="d-flex justify-content-around mt-5">
        <Button className={styles.button} onClick={closeModal} name='Ok' />
      </div>
    </PureModal>
  );
}