/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from 'modules/modals';
import {
  getAccountSelector,
  getDecimalsSelector,
  getModalDataSelector,
  getTickerSelector
} from 'selectors';
import ModalBody from 'containers/components/modals/modal-body';
import {PrivateTransactionConfirm} from './PrivateTransactionConfirm/PrivateTransactionConfirm';
import SendApolloForm from './form';
import { sendMoneyOfflineTransaction } from 'helpers/transactions';
import { setModalProcessingFalseAction, setModalProcessingTrueAction } from 'actions/modals';

export default function SendApollo({ closeModal, processForm }) {
  const [ isShowNotification, setIsShowNotification ] = useState(false);
  const dispatch = useDispatch();

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

    dispatch(setModalProcessingTrueAction())

    if (values.doNotSign) {
      data.publicKey = await crypto.getPublicKeyAPL(account, true);
      delete data.secretPhrase;
    }

    if (values.phasingFinishHeight) {
      data.phased = true;
    }

    if (values.alias) {
      data.recipient = values.alias;
    }

    const res = await sendMoneyOfflineTransaction({
      recipient: data.recipient,
      secretPhrase: data.secretPhrase,
      amountATM: data.amountATM,
      feeATM: data.feeATM,
      deadline: data.deadline,
    });

    dispatch(setModalProcessingFalseAction());

    if (res && res.errorCode) {
      NotificationManager.error(res.errorDescription, 'Error', 5000);
      return;
    }

    if (res.broadcasted === false) {
      dispatch(setBodyModalParamsAction('RAW_TRANSACTION_DETAILS', {
        request: data,
        result: res,
      }));
    } else {
      closeModal();
    }

    NotificationManager.success('Transaction has been submitted!', null, 5000);
  }, [account, closeModal, decimals, dispatch, processForm]);

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
      }}
      isLoadValue
    >
      {isShowNotification && <PrivateTransactionConfirm onClose={handleShowNotification(false)} />}
      <SendApolloForm
        onPrivateTransactionChange={handleShowNotification}
        isShowPrivateTransaction={isShowNotification}
        ticker={ticker}
      />
    </ModalBody>
  );
}
