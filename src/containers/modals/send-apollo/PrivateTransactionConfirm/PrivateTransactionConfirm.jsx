/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */
import React from 'react';
import { useDispatch } from 'react-redux';
import InfoBox from '../../../components/info-box';
import Button from '../../../components/button';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import styles from './index.module.scss';

// values prop goes from ModalBody by default
export const PrivateTransactionConfirm = ({ onClose, values }) => {
  const dispatch = useDispatch();

  const handleAgree = () => {
    const { privateTransaction, ...formValues } = values;
    dispatch(setBodyModalParamsAction('SEND_APOLLO_PRIVATE', { ...formValues, feeATM: 5 }))
  };

  return (
    <div className={styles.privateTransactionConfirmWrapper}>
      <InfoBox info className={styles.privateTransactionConfirmInfoBox}>
      <button type="button" onClick={onClose} className="exit">
        <i className="zmdi zmdi-close" />
      </button>
        Please note: Exchanges may not support private transactions, we recommend sending publically to exchanges.
        <br />
        Private transactions currently protect down the API level. Database level protection will start with Olympus 2.0
        <br />
        <div className={styles.privateTransactionConfirmButtonWrapper}>
          <Button
            className="mt-3"
            name="I agree"
            onClick={handleAgree}
          />
        </div>
      </InfoBox>
    </div>
  )
}