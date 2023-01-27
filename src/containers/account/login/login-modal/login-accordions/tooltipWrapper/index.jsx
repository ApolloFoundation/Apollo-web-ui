import React from 'react';
import classNames from 'classnames';
import Checked from 'assets/check-icon.png';
import Minus from 'assets/minus-icon.png';

import styles from './index.module.scss';

export const TooltipWrapper = ({ list }) => {

  const renderItem = ({iconChecked, text}, index) => { 
    const icon = iconChecked ? Checked : Minus;
    return (
      <li key={index.toString()} className={styles.tooltipWrapperItem}>
        <img 
          src={icon}
          alt='item'
          className={
            classNames(
              styles.tooltipWrapperIcon,
              { [styles.tooltipWrapperIconMinus]: !iconChecked }
            )
          }
        />
        <p className={styles.tooltipWrapperText}>{text}</p>
      </li>
    );
  }
  
  return (
    <ul className={styles.tooltipWrapper}>
      {list.map(renderItem)}
    </ul>
  );
}