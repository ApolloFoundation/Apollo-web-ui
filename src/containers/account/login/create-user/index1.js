/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';
import classNames from 'classnames';
import {
  Checkbox, Form, Text,
} from 'react-form';
import { generatePDF } from '../../../../actions/account';
import { getAccountDataAction } from '../../../../actions/login';
import crypto from '../../../../helpers/crypto/crypto';
import store from '../../../../store';
import InputForm from '../../../components/input-form';
import InfoBox from '../../../components/info-box';
import ContentLoader from '../../../components/content-loader';
import ButtonTabs from '../../../components/button-tabs';
import VaultWalletForm from './forms/vaultWalletForm';
import StandartWalletForm from './forms/standardWalletForm';

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


  const handleTab = useCallback(selectTab => {
    setActiveTab(selectTab);
  }, []);

  const handleFormSubmit = useCallback(async values => {
    if (selectedOption === 0) {
      if (values.secretPhrase === accountData.passphrase) {
        setIsPending(true);
        dispatch(getAccountDataAction({ account: accountData.accountRS }));
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

  return (
    <div className="dark-card">
      <span onClick={handleClose} className="exit">
        <i className="zmdi zmdi-close" />
      </span>
      <p className="title">Create New Wallet</p>
      {!isValidating ? (
        <div className="form-tabulator no-padding">
          <ButtonTabs
            tabs={tabs}
            onClick={handleTab}
            isActive={activeTab}
          />
          <VaultWalletForm
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
      ) : (
        <Form
          onSubmit={handleFormSubmit}
          render={({ submitForm, setValue }) => (
            <form
              className="active"
              onSubmit={submitForm}
            >
              <div
                className="form-group row form-group-white"
              >
                <label>
                  Secret phrase
                </label>
                <InputForm
                  isPlain
                  className="form-control"
                  type="password"
                  field="secretPhrase"
                  placeholder="Secret Phrase"
                  setValue={setValue}
                />
              </div>
              <button
                type="submit"
                name="closeModal"
                className="btn"
                disabled={!!isPending}
              >
                {isPending ? (
                  <div className="ball-pulse">
                    <div />
                    <div />
                    <div />
                  </div>
                ) : (
                  <span>Create New Account</span>
                )}
              </button>
            </form>
          )}
        />
      )}
    </div>
  );
}
