import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const Switcher = ({
  name,
  value,
  onChange,
  label,
  id
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.checked);
    if (onChange) onChange(e);
  }

  return (
    <label htmlFor={`switcher-${name}`} className={styles.switcherWrapper}>
      <input
        id={`switcher-${name}`}
        name={name}
        className={styles.switcherInput}
        type="checkbox"
        checked={localValue}
        onChange={handleChange}
      />
      <div id="switcher-standard-wallet" className={styles.switcherContent}>
        <div
          className={
            classNames(
              styles.switcherField,
              {
                [styles.switcherFieldActive]: localValue,
              }
            )}
          />
        <span className={styles.switcherLabel}>{label}</span>
      </div>
    </label>
  );
}
