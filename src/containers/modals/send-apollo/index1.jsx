/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../modules/modals';
import ModalBody from '../../components/modals/modal-body1';
import SendApolloForm from './form1';

export default function SendApollo(props) {
  const dispatch = useDispatch();

  const { closeModal, processForm } = props;

  const [alias, setAlias] = useState(null);

  const { modalData } = useSelector(state => state.modals);

  const { account } = useSelector(state => state.account);

  const handleFormSubmit = useCallback(async values => {
    const data = { ...values };
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

    // export const processForm = (values, requestType, successMesage, successCallback) => {

    processForm(data, 'sendMoney', 'Transaction has been submitted!', res => {
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
  }, [account, alias, closeModal, dispatch, processForm]);

  const onChosenTransactionOnAlias = () => setAlias(null);

  const handelChangeAlias = ({ value }) => setAlias(value);

  return (
    <ModalBody
      modalTitle="Create transaction"
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      isFee
      isAdvanced
      submitButtonName="Send"
      idGroup="send-money-modal-"
      initialValues={{
        recipient: (modalData && modalData.recipient) || '',
        amountATM: (modalData && modalData.amountATM) || '',
        encrypt_message: true,
      }}
    >
      <SendApolloForm
        onChangeAlias={handelChangeAlias}
        onChosenTransactionOnAlias={onChosenTransactionOnAlias}
      />
    </ModalBody>
  );
}
