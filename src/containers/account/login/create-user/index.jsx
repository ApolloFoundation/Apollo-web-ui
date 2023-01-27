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
import StandartWalletForm from './forms/standardWalletForm';
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

export default function CreateUser(props) {
  const dispatch = useDispatch();

  const { account, closeModal, handleClose } = props;

  const [activeTab, setActiveTab] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [generatedPassphrase, setGeneratedPassphrase] = useState(null);
  const [generatedAccount, setGeneratedAccount] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [isCustomPassphraseTextarea, setIsCustomPassphraseTextarea] = useState(null);
  const [currPassphrase, setCurrPassphrase] = useState(null);

  const handleTab = useCallback(selectTab => {
    setActiveTab(selectTab);
  }, []);

  const handleFormSubmit = useCallback(async values => {
    if (selectedOption === 0) {
      if (values.secretPhrase === currPassphrase) {
        setIsPending(true);
        dispatch(getAccountDataAction({ account: accountData.currencies[0].wallets[0].address }));
      } else {
        NotificationManager.error('Incorrect secret phrase!', 'Error', 5000);
      }
    }
    if (selectedOption === 1) {
      if (values.secretPhrase === generatedPassphrase) {
        setIsPending(true);
        dispatch(getAccountDataAction({ account: generatedAccount }));
      } else {
        NotificationManager.error('Incorrect secret phrase!', 'Error', 5000);
      }
    }
  }, [accountData, dispatch, generatedAccount, generatedPassphrase, selectedOption]);

  useEffect(() => {
    if (account) {
      closeModal();
    }
  }, [account, closeModal]);

  const content = useMemo(() => {
    let form = null;

    if (isValidating) {
      form = (
        <CreateAccount
          onSubmit={handleFormSubmit}
          isPending={isPending}
        />
      );
    } else {
      form = (
        <div className="form-tabulator no-padding">
          <ButtonTabs
            tabs={tabs}
            onClick={handleTab}
            isActive={activeTab}
          />
          <VaultWalletForm
            setCurrPassphrase={setCurrPassphrase}
            currPassphrase={currPassphrase}
            onSubmit={handleFormSubmit}
            activeTab={activeTab}
            accountData={accountData}
            isValidating={isValidating}
            isPending={isPending}
            isCustomPassphraseTextarea={isCustomPassphraseTextarea}
            setIsCustomPassphraseTextarea={setIsCustomPassphraseTextarea}
            setAccountData={setAccountData}
            setSelectedOption={setSelectedOption}
            setIsValidating={setIsValidating}
            handleClose={handleClose}
          />
          <StandartWalletForm
            activeTab={activeTab}
            setSelectedOption={setSelectedOption}
            setGeneratedAccount={setGeneratedAccount}
            setIsValidating={setIsValidating}
            setGeneratedPassphrase={setGeneratedPassphrase}
            generatedPassphrase={generatedPassphrase}
            generatedAccount={generatedAccount}
            isCustomPassphraseTextarea={isCustomPassphraseTextarea}
          />
        </div>
      );
    }

    return form;
  }, [
    accountData, activeTab, generatedAccount, generatedPassphrase, handleClose,
    handleFormSubmit, handleTab, isCustomPassphraseTextarea, isPending, isValidating,
  ]);

  return (
    <div className="dark-card">
      <span onClick={handleClose} className="exit">
        <i className="zmdi zmdi-close" />
      </span>
      <p className="title">Create New Wallet</p>
      {content}
    </div>
  );
}
