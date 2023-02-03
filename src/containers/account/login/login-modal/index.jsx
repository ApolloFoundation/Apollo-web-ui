/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import classNames from 'classnames';
import { useSingleAccordionItem } from 'hooks/useSingleAccordionItem';
import { VaultAccordion } from './login-accordions/vault-wallet/vault';
import { StandartWallet } from './login-accordions/standart-wallet';
import { SECTIONS } from '../constants';
import styles from './index.module.scss';
import '../Login.css';

export default function LoginModal({ handleModal }) {
  const { active, onChange } = useSingleAccordionItem();

  return (
    <div>
      <div className="dark-card login-form">
        <p className="title">Log in</p>
        <StandartWallet id={2} onChange={onChange} active={active} />
        <VaultAccordion id={1} onChange={onChange} active={active} />
      </div>
      <div className={styles.line}>Or</div>
      <div
        className={classNames("button-block", styles.buttonIcon)}
        onClick={() => handleModal(SECTIONS.IMPORT_ACCOUNT)}
      >
        <span className="title">Advanced user?</span>
        <span className="sub-title">Import Vault Wallet</span>
      </div>
      <div
        className="button-block"
        onClick={() => handleModal(SECTIONS.CREATE_USER)}
      >
        <span className="title">New user?</span>
        <span className="sub-title">Create Apollo Wallet</span>
      </div>
    </div>
  );
}
