import React from 'react';
import cn from 'classnames';

import styles from './style.module.scss';

export default function ButtonTabs(props) {
  const {
    onClick, className, tabs, isActive,
  } = props;

  return (
    <div className={styles['form-tab-nav-box']}>
      {tabs.map(tab => (
        <button
          type="button"
          onClick={() => onClick(tab.id)}
          className={cn(styles['form-tab'], { [styles.active]: isActive === tab.id }, styles[className])}
        >
          <span className={styles['button-content']}>
            {!!tab.icon && <i className={cn(`zmdi zmdi-${tab.icon}`, styles.icon)} />}
            <p className={styles['button-text']}>
              {tab.label}
            </p>
          </span>
        </button>
      ))}
    </div>
  );
}
