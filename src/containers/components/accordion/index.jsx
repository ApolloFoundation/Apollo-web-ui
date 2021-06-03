import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const Accordion = ({ 
  header,
  defaultInstance = false,
  currentState,
  children,
  id,
  onSelectItem
}) => {
  const [isOpen, setIsOpen] = useState(defaultInstance);

  useEffect(() => {
    if (currentState !== undefined) setIsOpen(currentState);
  }, [currentState, setIsOpen]);

  const handleAccordionOpen = useCallback(() => {
    if (id && onSelectItem) {
      onSelectItem(id);
    } else {
      setIsOpen(state => !state);
    }
  }, [setIsOpen, onSelectItem]);


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
