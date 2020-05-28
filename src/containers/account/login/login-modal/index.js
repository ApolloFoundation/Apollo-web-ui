/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import AccountIdForm from './forms/viaAccountIdForm';
import SecretPhraseForm from './forms/viaSecretPhraseForm';

import '../Login.css';

export default function LoginModal({ handleModal }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTab = useCallback((e, index) => {
    e.preventDefault();

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
          <div className="form-tab-nav-box">
            <button
              type="button"
              onClick={e => handleTab(e, 0)}
              className={classNames({
                'form-tab': true,
                active: activeTab === 0,
              })}
            >
              <p>With Account ID</p>
            </button>
            <button
              type="button"
              onClick={e => handleTab(e, 1)}
              className={classNames({
                'form-tab': true,
                active: activeTab === 1,
              })}
            >
              <p>With Secret Phrase</p>
            </button>
          </div>
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
