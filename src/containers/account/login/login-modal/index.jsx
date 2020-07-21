/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback, useMemo } from 'react';
import ButtonTabs from '../../../components/button-tabs';
import AccountIdForm from './forms/viaAccountIdForm';
import SecretPhraseForm from './forms/viaSecretPhraseForm';

import '../Login.css';

const tabs = [
  {
    label: 'With Account ID',
    id: 0,
  },
  {
    label: 'With Secret Phrase',
    id: 1,
  },
];

export default function LoginModal({ handleModal }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTab = useCallback(index => {
    setActiveTab(index);
  }, []);

  const selectForm = useMemo(() => {
    if (activeTab === 0) {
      return <AccountIdForm activeTab={activeTab} />;
    }
    if (activeTab === 1) {
      return <SecretPhraseForm activeTab={activeTab} />;
    }

    return null;
  }, [activeTab]);

  return (
    <div>
      <div className="dark-card login-form">
        <p className="title">Log in</p>
        <div className="form-tabulator">
          <ButtonTabs
            tabs={tabs}
            onClick={handleTab}
            isActive={activeTab}
          />
          {selectForm}
        </div>
      </div>
      <div
        className="button-block"
        onClick={() => handleModal('IMPORT_ACCOUNT')}
      >
        <span className="title">Advanced user?</span>
        <span className="sub-title">Import Vault Wallet</span>
      </div>
      <div
        className="button-block"
        onClick={() => handleModal('CREATE_USER')}
      >
        <span className="title">New user?</span>
        <span className="sub-title">Create Apollo Wallet</span>
      </div>
    </div>
  );
}
