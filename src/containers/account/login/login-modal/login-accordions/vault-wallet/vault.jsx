import React from 'react';
import { Accordion } from 'containers/components/accordion';
import { Tooltip } from 'containers/components/tooltip';
import ShieldIcon from '../../../../../../assets/shield-check.svg';
import AccountIdForm from '../../forms/viaAccountIdForm';

import styles from './index.module.scss';

export const VaultAccordion = ({ active, onChange, id }) => {
  return (
    <Accordion
      id={id}
      onSelectItem={onChange}
      currentState={active === id}
      header={(
        <div className={styles.vaultHeader}>
          <span>vault wallet</span>
          <figure className={styles.vaultIconWrapper}>
            <img className={styles.vaultIcon} src={ShieldIcon} alt='shield' />
          </figure>
          <Tooltip>

          </Tooltip>
        </div>
      )}
    >
      <AccountIdForm /> 
    </Accordion>
  );
}