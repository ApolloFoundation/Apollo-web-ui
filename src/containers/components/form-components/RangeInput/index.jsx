import React, { useEffect } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const RangeInput = ({
  field,
  name,
  label,
  min,
  max,
  className,
  form,
  defaultValue,
}) => {

  useEffect(() => {
    form.setFieldValue(field.name, defaultValue);
  }, []);

  return (
    <div className={classNames(styles.rangeWrapper, className)}>
        <p className={styles.rangeLabels}>
            <label>
              {label}
            </label>
            <span className={styles.rangeBadge}>
                {field?.value}
            </span>
        </p>
        <input
          defaultValue={min}
          type="range"
          className={'custom-range'}
          max={max}
          min={min}
          name={name}
          {...field}
        />
    </div>
  );
}