/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import classNames from 'classnames';

import '../Login.css';
import { VaultAccordion } from './login-accordions/vault-wallet/vault';
import { StandartWallet } from './login-accordions/standart-wallet';
import styles from './index.module.scss';
import { useSingleAccordionItem } from 'hooks/useSingleAccordionItem';

export default function LoginModal({ handleModal }) {
  const { active, onChange } = useSingleAccordionItem();

  return (
    <div>
      <div className="dark-card login-form">
        <p className="title">Log in</p>
        <VaultAccordion id={1} onChange={onChange} active={active} />
        <StandartWallet id={2} onChange={onChange} active={active} />
      </div>
      <div className={styles.line}>Or</div>
      <div
        className={classNames("button-block", styles.buttonIcon)}
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
