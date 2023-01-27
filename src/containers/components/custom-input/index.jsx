import React from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';

export default function CustomInput(props) {
  const {
    label, className, type, disableArrows, disabled, id, children, onChange, value,
    maxValue, minValue, step, isSpecialSymbols, name, placeholder, classNameWrapper, ...rest
  } = props;

  const isNumberInput = (type === 'tel' || type === 'float') && !disabled && !disableArrows;

  const parseValue = value => {
    let currentValue = value;

    if (type === 'tel') {
      currentValue = currentValue.replace(/[^\d]/g, '');
    }
    if (type === 'float') {
      currentValue = currentValue.replace(',', '.');
      if (currentValue === '.') currentValue = '0.';
      currentValue = currentValue.replace(/[^\d.]|\.(?=.*\.)/g, '');
      if (!currentValue.includes('.') && currentValue.length <= 2) currentValue = Number(currentValue).toString();
      if (!value.target && currentValue.includes('.')) {
        let fract = currentValue.substring(currentValue.indexOf('.'));
        currentValue = currentValue.substring(0, currentValue.indexOf('.'));
        if (fract.length > 10) {
          fract = fract.substring(0, 10);
        }
        currentValue += fract;
      }
    }
    if (type === 'password' && type === 'tel' && type === 'float' && !isSpecialSymbols) {
      currentValue = currentValue.replace(/[;`'"%!#&~<>@_=*+?^${}|[\]\\]/g, '');
    }
    return currentValue;
  };

  const handleClickUp = () => {
    if (!disabled) {
      let newValue = value !== '' ? parseFloat(value) : 0;
      const newStep = step || 1;
      newValue += newStep;

      if (maxValue !== undefined && newValue > parseFloat(maxValue)) {
        newValue = maxValue;
      }

      onChange(newValue);
    }
  };

  const handleClickDown = () => {
    if (!disabled) {
      let newValue = value !== '' ? parseFloat(value) : 0;
      if (newValue > 0) {
        const newStep = step || 1;
        newValue -= newStep;
        if (newValue < 0) newValue = 0;
        if (minValue !== undefined && newValue < parseFloat(minValue)) {
          newValue = minValue;
        }

        onChange(newValue);
      }
    }
  };

  const handleChange = ({ target: { value } }) => {
    const parsedValue = parseValue(value);
    onChange(parsedValue);
  };

  return (
    <div className={cn("form-group", classNameWrapper, {
        'mb-15': type !== 'hidden',
        [styles.hidden]: type === 'hidden',
      })}
    >
      <label htmlFor={id}>
        {label}
      </label>
      <div className={cn('input-text-wrap', { 'input-text-number-wrap': isNumberInput })}>
        <div className={styles['input-wrapper']}>
          <input
            name={name}
            value={value}
            disabled={disabled}
            type={type}
            id={id}
            onChange={handleChange}
            placeholder={placeholder}
            className={`form-control ${className}`}
            autoComplete="on"
            {...rest}
          />
          {isNumberInput && (
            <div className={styles.inputNumberWrap}>
              <div className="input-number-up" onClick={handleClickUp} />
              <div className="input-number-down" onClick={handleClickDown} />
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
