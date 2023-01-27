/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../modules/modals';
import {
  getAccountSelector,
  getDecimalsSelector,
  getModalDataSelector,
  getTickerSelector
} from '../../../selectors';
import ModalBody from '../../components/modals/modal-body';
import SendApolloForm from './form';
import {PrivateTransactionConfirm} from './PrivateTransactionConfirm/PrivateTransactionConfirm';

export default function SendApollo({ closeModal, processForm }) {
  const [ isShowNotification, setIsShowNotification ] = useState(false);
  const dispatch = useDispatch();

  const [alias, setAlias] = useState(null);

  const modalData = useSelector(getModalDataSelector, shallowEqual);
  const account = useSelector(getAccountSelector);
  const ticker = useSelector(getTickerSelector);
  const decimals = useSelector(getDecimalsSelector);

  const handleFormSubmit = useCallback(async values => {
    const { privateTransaction, ...data } = values;
    if (!values.secretPhrase || values.secretPhrase.length === 0) {
      NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
      return;
    }

    if (values.doNotSign) {
      data.publicKey = await crypto.getPublicKeyAPL(account, true);
      delete data.secretPhrase;
    }

    if (values.phasingFinishHeight) {
      data.phased = true;
    }

    if (values.alias) {
      data.recipient = alias;
    }

    processForm({ decimals, ...data }, 'sendMoney', 'Transaction has been submitted!', res => {
      if (res.broadcasted === false) {
        dispatch(setBodyModalParamsAction('RAW_TRANSACTION_DETAILS', {
          request: data,
          result: res,
        }));
      } else {
        dispatch(setBodyModalParamsAction(null, {}));
        closeModal();
      }

      NotificationManager.success('Transaction has been submitted!', null, 5000);
    });
  }, [account, alias, closeModal, decimals, dispatch, processForm]);

  const onChosenTransactionOnAlias = () => setAlias(null);

  const handelChangeAlias = ({ value }) => setAlias(value);

  const handleShowNotification = (value) => () => {
    setIsShowNotification(value);
  }

  return (
    <ModalBody
      modalTitle="Create transaction"
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      ticker={ticker}
      isFee
      isAdvanced
      submitButtonName="Send"
      idGroup="send-money-modal-"
      initialValues={{
        recipient: (modalData && modalData.recipient) || '',
        amountATM: (modalData && modalData.amountATM) || '',
        encrypt_message: true,
      }}
      isLoadValue
    >
      {isShowNotification && <PrivateTransactionConfirm onClose={handleShowNotification(false)} />}
      <SendApolloForm
        onChangeAlias={handelChangeAlias}
        onChosenTransactionOnAlias={onChosenTransactionOnAlias}
        onPrivateTransactionChange={handleShowNotification}
        isShowPrivateTransaction={isShowNotification}
        ticker={ticker}
      />
    </ModalBody>
  );
}
