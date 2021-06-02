/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useCallback, useMemo,
} from 'react';
import AccountIdForm from './forms/viaAccountIdForm';
import SecretPhraseForm from './forms/viaSecretPhraseForm';
import ButtonTabs from '../../../components/button-tabs';
import ShieldIcon from '../../../../assets/shield-check.svg';

import '../Login.css';
import { Accordion } from 'containers/components/accordion';
import { Tooltip } from 'containers/components/tooltip';
import { VaultAccordion } from './login-accordions/vault-wallet/vault';
import { StandartWallet } from './login-accordions/standart-wallet';
import styles from './index.module.scss';

const tabs = [
  {
    label: 'Vault Wallet',
    id: 0,
  },
  {
    label: 'Standart Wallet',
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
        {/* <div className="form-tabulator">
          <ButtonTabs
            tabs={tabs}
            onClick={handleTab}
            isActive={activeTab}
          />
          {selectForm}
        </div> */}
        <VaultAccordion />
        <StandartWallet />
      </div>
      <div className={styles.line}>Or</div>
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
