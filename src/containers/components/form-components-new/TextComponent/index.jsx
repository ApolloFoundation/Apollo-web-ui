import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const TextComponentWithIcon = ({
  label,
  id,
  field,
  placeholder,
  icon,
  onIconClick,
  className="",
  ...rest
}) => (
  <div className={classNames(styles.textCommonWrapper, className)}>
      {label && (
        <label htmlFor={id}>{label}</label>
      )}
      <div className={styles.textCommonInputWrapper}>
        <input
          id={id}
          className={styles.textComponentInput}
          placeholder={placeholder}
          {...rest}
          {...field}
        />
        {icon && (
          <div
            className={styles.textComponentAppend}
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}
      </div>
  </div> 
);