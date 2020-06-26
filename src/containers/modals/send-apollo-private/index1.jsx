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
import ModalBody from '../../components/modals/modal-body1';
import InfoBox from '../../components/info-box';
import Button from '../../components/button';
import SendPrivateApolloForm from './form1';

export default function SendApolloPrivate(props) {
  const dispatch = useDispatch();

  const { closeModal } = props;

  const { modalData } = useSelector(state => state.modals);

  const [isPrivateTransactionAlert, setIsPrivateTransactionAlert] = useState(false);
  const [useMixer, setUseMixer] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [newMixerData, setNewMixerData] = useState(null);

  const handleGetMixerAccount = useCallback(async () => {
    const { accountPrefix, mixerUrl } = props;
    if (!mixerUrl) return;

    const mixerData = await getMixerAccount(mixerUrl);
    if (mixerData && mixerData.rsId) {
      const mixerAccount = mixerData.rsId;
      mixerData.rsId = mixerAccount.replace('APL-', `${accountPrefix}-`);
      setNewMixerData(mixerData);
      setUseMixer(true);
    }
  }, [props]);

  const handleFormSubmit = async values => {
    debugger
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

      const newValues = values;

      if (useMixer) {
        newValues.messageToEncrypt = JSON.stringify({
          type: 'REQUEST_MIXING',
          epicId: values.recipient,
          approximateMixingDuration: values.duration, // Minutes
        });

        if (values.amountATM < 100) {
          NotificationManager.error('To use mixer you should send at least 100 APL.', 'Error', 5000);
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

      dispatch(await submitForm(params, 'sendMoneyPrivate'))
        .done(privateTransaction => {
          if (privateTransaction && privateTransaction.errorCode) {
            NotificationManager.error(privateTransaction.errorDescription, 'Error', 5000);
          } else {
            NotificationManager.success('Private transaction has been submitted.', null, 5000);
            dispatch(setBodyModalParamsAction(null, {}));
          }
          setIsPending(false);
        });
    }
  };

  const setConfirm = () => {
    setIsPrivateTransactionAlert(true);
  };

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
      isDisabled={!isPrivateTransactionAlert}
      idGroup="send-private-money-modal-"
      initialValues={{
        recipient: (modalData && modalData.recipient) || '',
        amountATM: (modalData && modalData.amountATM) || '',
        mixerAccount: useMixer && (newMixerData && newMixerData.rsId),
        mixerPublicKey: useMixer && (newMixerData && newMixerData.publicKey),
        duration: (modalData && modalData.duration) || '',
        feeATM: (modalData && modalData.feeATM) || '5',
        isMixer: useMixer,
      }}
    >
      {!isPrivateTransactionAlert && (
        <InfoBox info>
          Please note: Exchanges may not support private transactions, we recommend sending publically to exchanges.
          <br />
          Private transactions currently protect down the the API level. Database level protection will start with Olympus 2.0
          <br />
          <Button
            className="mt-3"
            name="I agree"
            onClick={setConfirm}
          />
        </InfoBox>
      )}
      <SendPrivateApolloForm
        useMixer={useMixer}
        mixerData={newMixerData}
      />
    </ModalBody>
  );
}
