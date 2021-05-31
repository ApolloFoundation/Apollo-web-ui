import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const Tab = ({ header, defaultInstance = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultInstance);

  const handleTabOpen = () => {
    setIsOpen(state => !state);
  }

  return (
    <div className={classNames(styles.tab, { [styles.tabActive]: isOpen })}>
      <div className={styles.tabHeader} onClick={handleTabOpen}>
        <div className={styles.tabInfo}>{header}</div>
        <span className={classNames(styles.tabIcon, {[styles.tabIconOpen]: isOpen})} />
      </div>
      <div className={classNames(styles.tabContent, { [styles.tabContentOpen]: isOpen })}>
        {children}
      </div>
    </div>
  );
}
