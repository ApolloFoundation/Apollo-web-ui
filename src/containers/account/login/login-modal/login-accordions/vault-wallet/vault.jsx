import React from 'react';
import { Accordion } from 'containers/components/accordion';
import { Tooltip } from 'containers/components/tooltip';
import ShieldIcon from '../../../../../../assets/shield-check.svg';
import AccountIdForm from '../../forms/viaAccountIdForm';

import styles from './index.module.scss';

export const VaultAccordion = () => {
  return (
    <Accordion
      header={(
        <div className={styles.vaultHeader}>
          <span>vault wallet</span>
          <img className={styles.vaultIcon} src={ShieldIcon} alt='shield' />
          <Tooltip>

          </Tooltip>
        </div>
      )}
    >
      <AccountIdForm /> 
    </Accordion>
  );
}