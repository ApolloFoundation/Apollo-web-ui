import React from 'react';
import classNames from 'classnames';
import Icon from '../../../assets/objection-mark.svg';
import styles from './index.module.scss';

export const TooltipLogin = ({ icon = Icon, children, className }) => {
  return (
    <div className={styles.tooltipLogin}>
      <figure className={styles.tooltipLoginIconWrapper}>
        <img className={styles.tooltipLoginIcon} src={icon} alt='tooltip' />
      </figure>
      <div className={classNames(styles.tooltipLoginContent, className)}>
        {children}
      </div>
    </div>
  );
}