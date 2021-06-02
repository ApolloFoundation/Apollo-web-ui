import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const Accordion = ({ header, defaultInstance = false, currentState, children }) => {
  const [isOpen, setIsOpen] = useState(defaultInstance);

  useEffect(() => {
    if (currentState) handleAccordionOpen(currentState);
  }, [currentState, handleAccordionOpen]);

  const handleAccordionOpen = useCallback(() => {
    setIsOpen(state => !state);
  }, [setIsOpen]);

  return (
    <div className={classNames(styles.accordion, { [styles.accordionActive]: isOpen })}>
      <div className={styles.accordionHeader} onClick={handleAccordionOpen}>
        <div className={styles.accordionInfo}>{header}</div>
        <span className={classNames(styles.accordionIcon, {[styles.accordionIconOpen]: isOpen})} />
      </div>
      <div className={classNames(styles.accordionContent, { [styles.accordionContentOpen]: isOpen })}>
        {children}
      </div>
    </div>
  );
}
