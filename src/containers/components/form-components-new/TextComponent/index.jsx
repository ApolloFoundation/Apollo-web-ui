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
  name,
  ...rest
}) => (
  <div className={classNames(styles.textCommonWrapper, className)}>
      {label && (
        <label htmlFor={`${id}-${name}`}>{label}</label>
      )}
      <div className={styles.textCommonInputWrapper}>
        <input
          id={`${id}-${name}`}
          className={styles.textComponentInput}
          placeholder={placeholder}
          name={name}
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