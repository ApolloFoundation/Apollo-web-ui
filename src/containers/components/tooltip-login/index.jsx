import React from 'react';
import classNames from 'classnames';
import Icon from 'assets/objection-mark.svg';
import styles from './index.module.scss';

export const Tooltip = ({ icon = Icon, children, className }) => {
  return (
    <div className={styles.tooltip}>
      <figure className={styles.tooltipIconWrapper}>
        <img className={styles.tooltipIcon} src={icon} alt='tooltip' />
      </figure>
      <div className={classNames(styles.tooltipContent, className)}>
        {children}
      </div>
    </div>
  );
}