/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useState, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../modules/modals';
import { getMixerAccount } from '../../../actions/transactions';
import submitForm from '../../../helpers/forms/forms';
import ModalBody from '../../components/modals/modal-body';
import {
  getConstantsSelector,
  getDecimalsSelector,
  getModalDataSelector,
  getTickerSelector
} from '../../../selectors';
import SendPrivateApolloForm from './form';

export default function SendApolloPrivate({ closeModal }) {
  const dispatch = useDispatch();
  const modalData= useSelector(getModalDataSelector);
  const { mixerUrl, accountPrefix } = useSelector(getConstantsSelector);
  const ticker = useSelector(getTickerSelector);
  const decimals = useSelector(getDecimalsSelector);

  const [useMixer, setUseMixer] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [newMixerData, setNewMixerData] = useState(null);

  const handleGetMixerAccount = useCallback(async () => {
    if (!mixerUrl) return;

    const mixerData = await getMixerAccount(mixerUrl);

    if (mixerData && mixerData.rsId) {
      const mixerAccount = mixerData.rsId;
      mixerData.rsId = mixerAccount.replace(`${ticker}-`, `${accountPrefix || ''}-`);
      setNewMixerData(mixerData);
      setUseMixer(true);
    }
  }, [accountPrefix, mixerUrl]);

  const handleFormSubmit = useCallback(async values => {
    if (!isPending) {
      if (!values.recipient) {
        NotificationManager.error('Recipient not specified.', 'Error', 5000);
        return;
      }
      if (!values.amountATM) {
        NotificationManager.error('Amount is required.', 'Error', 5000);
        return;
      }
      if (!values.feeATM) {
        NotificationManager.error('Fee not specified.', 'Error', 5000);
        return;
      }

      const newValues = { ...values };

      if (values.isMixer) {
        newValues.messageToEncrypt = JSON.stringify({
          type: 'REQUEST_MIXING',
          epicId: values.recipient,
          approximateMixingDuration: values.duration, // Minutes
        });

        if (values.amountATM < 100) {
          NotificationManager.error(`To use mixer you should send at least 100 ${ticker}.`, 'Error', 5000);
          return;
        }

        if (values.duration < 15) {
          NotificationManager.error('The mixing time should be at least 15 minutes.', 'Error', 5000);
          return;
        }

        if (values.duration > 11000) {
          NotificationManager.error('The mixing time should not exceed 11000 minutes.', 'Error', 5000);
          return;
        }

        newValues.recipient = values.mixerAccount;
        newValues.recipientPublicKey = values.mixerPublicKey;

        delete newValues.mixerAccount;
      }

      setIsPending(true);

      const {
        duration, isMixer, mixerPublicKey, ...params
      } = newValues;

      dispatch(await dispatch(submitForm.submitForm(params, 'sendMoneyPrivate', decimals)))
        .done(privateTransaction => {
          if (privateTransaction && privateTransaction.errorCode) {
            NotificationManager.error(privateTransaction.errorDescription, 'Error', 5000);
          } else {
            NotificationManager.success('Private transaction has been submitted.', null, 5000);
            closeModal();
            dispatch(setBodyModalParamsAction(null, {}));
          }
          setIsPending(false);
        });
    }
  }, [closeModal, decimals, dispatch, isPending]);

  useEffect(() => {
    handleGetMixerAccount();
  }, [handleGetMixerAccount]);

  return (
    <ModalBody
      modalTitle="Send Private transaction"
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      isAdvanced
      isPending={isPending}
      submitButtonName="Send"
      idGroup="send-private-money-modal-"
      initialValues={{
        recipient: (modalData && modalData.recipient) || '',
        amountATM: (modalData && modalData.amountATM) || '',
        mixerAccount: useMixer && (newMixerData && newMixerData.rsId),
        mixerPublicKey: useMixer && (newMixerData && newMixerData.publicKey),
        duration: (modalData && modalData.duration) || '',
        feeATM: '5',
        isMixer: useMixer,
      }}
      isLoadValue
    >
      <SendPrivateApolloForm
        ticker={ticker}
        mixerData={newMixerData}
      />
    </ModalBody>
  );
}
