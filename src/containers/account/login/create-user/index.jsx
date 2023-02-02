/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getAccountDataAction } from 'actions/login';
import ButtonTabs from 'containers/components/button-tabs';
import VaultWalletForm from './forms/vaultWalletForm';
import StandartWalletForm from './Tabs/StandardWalletTab';
import CreateAccount from './forms/createAccountForm';

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
  const [accountData, setAccountData] = useState(null);

  const handleTab = useCallback(selectTab => {
    setActiveTab(selectTab);
  }, []);

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

  const content = useMemo(() => {
    if (accountData) {
      return (
        <CreateAccount
          onSubmit={handleFormSubmit}
          isPending={isPending}
        />
      );
    } 
    return (
      <div className="form-tabulator no-padding">
        <ButtonTabs
          tabs={tabs}
          onClick={setActiveTab}
          isActive={activeTab}
        />
        <VaultWalletForm
          activeTab={activeTab}
          setAccountData={setAccountData}
        />
        <StandartWalletForm
          activeTab={activeTab}
          setAccountData={setAccountData}
        />
      </div>
    );
  }, [activeTab, handleFormSubmit, isPending]);

  return (
    <div className="dark-card">
      <span onClick={handleClose} className="exit">
        <i className="zmdi zmdi-close" />
      </span>
      <p className="title">Create New Wallet</p>
      {accountData ? 
        <CreateAccount onSubmit={handleFormSubmit} isPending={isPending} /> 
        : (
        <div className="form-tabulator no-padding">
          <ButtonTabs
            tabs={tabs}
            onClick={setActiveTab}
            isActive={activeTab}
          />
          <VaultWalletForm
            activeTab={activeTab}
            setAccountData={setAccountData}
          />
          <StandartWalletForm
            activeTab={activeTab}
            setAccountData={setAccountData}
          />
        </div>

      )}
    </div>
  );
}
