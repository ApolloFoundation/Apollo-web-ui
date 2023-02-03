/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getAccountDataAction } from 'actions/login';
import ButtonTabs from 'containers/components/button-tabs';
import VaultWalletForm from './Tabs/VaultWalletForm';
import StandartWalletForm from './Tabs/StandardWalletTab';
import LoginForm from './LoginForm';

const tabs = [
  {
    label: 'Standard wallet',
    id: 0,
  },
  {
    label: 'Vault Wallet',
    id: 1,
    icon: 'shield-security',
  },
];

export default function CreateUser({ account, closeModal, handleClose }) {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [isPending, setIsPending] = useState(false);
  // this state need for compare user insert data at login form to the app
  // also this data add info about view (we are still showing generated account form or switch to login form)
  const [accountData, setAccountData] = useState(null);

  const handleFormSubmit = useCallback(values => {
    if(values.secretPhrase !== accountData.secretPhrase) {
      NotificationManager.error('Incorrect secret phrase!', 'Error', 5000);
      return;
    }
    setIsPending(true);
    dispatch(getAccountDataAction({ account: accountData.account }))
      .finally(() => {
        setIsPending(false);
      });
  }, [accountData, dispatch]);

  useEffect(() => {
    if (account) {
      closeModal();
    }
  }, [account, closeModal]);

  return (
    <div className="dark-card">
      <span onClick={handleClose} className="exit">
        <i className="zmdi zmdi-close" />
      </span>
      <p className="title">Create New Wallet</p>
      {accountData ?
        // form where user insert generated secretPhase. We compare it with generated data and do logic by accunt id
        <LoginForm onSubmit={handleFormSubmit} isPending={isPending} /> 
        : (
        <div className="form-tabulator no-padding">
          <ButtonTabs
            tabs={tabs}
            onClick={setActiveTab}
            isActive={activeTab}
          />
          {/** generate vault wallet */}
          <VaultWalletForm
            activeTab={activeTab}
            setAccountData={setAccountData}
          />
          {/** generate standart wallet */}
          <StandartWalletForm
            activeTab={activeTab}
            setAccountData={setAccountData}
          />
        </div>
      )}
    </div>
  );
}
