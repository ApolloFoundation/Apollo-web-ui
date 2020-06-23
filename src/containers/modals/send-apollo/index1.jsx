/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useField } from 'formik';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../modules/modals';
import submitForm from '../../../helpers/forms/forms';
import ModalBody from '../../components/modals/modal-body1';
import SendApolloForm from './form1';

export default function SendApollo(props) {
  const dispatch = useDispatch();

  const { closeModal, processForm } = props;

  const [activeTab, setActiveTab] = useState(0);
  const [advancedState, setAdvancedState] = useState(false);
  const [passphraseStatus, setPassphraseStatus] = useState(false);
  const [recipientStatus, setRecipientStatus] = useState(false);
  const [amountStatus, setAmountStatus] = useState(false);
  const [feeStatus, setFeeStatus] = useState(false);
  const [alias, setAlias] = useState(null);

  const { account, publicKey } = useSelector(state => state.account);
  const { modalData, modalsHistory, dashboardForm } = useSelector(state => state.modals);
  console.log(dashboardForm);

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
      }

      // if (dashboardForm) {
      //   dashboardForm.resetAll();
      //   dashboardForm.setValue('recipient', '');
      //   dashboardForm.setValue('feeATM', '1');
      // }
      NotificationManager.success('Transaction has been submitted!', null, 5000);
    });
  }, [account, alias, dispatch, processForm]);

  const onChosenTransactionOnAlias = () => setAlias(null);

  const handelChangeAlias = ({ value }) => setAlias(value);

  return (
    <ModalBody
      modalTitle="Create transaction"
      closeModal={closeModal}
      handleFormSubmit={values => handleFormSubmit(values)}
      isFee
      isAdvanced
      submitButtonName="Send"
      idGroup="send-money-modal-"
    >
      <SendApolloForm
        onChangeAlias={handelChangeAlias}
        onChosenTransactionOnAlias={onChosenTransactionOnAlias}
      />
    </ModalBody>
  );
}
